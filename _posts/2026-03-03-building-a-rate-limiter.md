---
title: "Building a Token-Bucket Rate Limiter"
subtitle: "Design, implementation, and benchmarks in Python and Go"
tags: [coding, python, go, systems, algorithms]
toc: true
math: true
image: "assets/images/posts/token-bucket-diagram.webp"
image_alt: "Token Bucket System Design Diagram"
description: "A hands-on walkthrough of implementing a token-bucket rate limiter with code in Python and Go."
---

> **Note:** This post was generated with Google's Gemini for the sole purpose of demonstrating the rich typographic, mathematical, code, figure, and table capabilities of the Eyvan template.

Rate limiting is a foundational part of modern systems design. Whether you are running a public API, managing internal services, or protecting a database from cascading failures, controlling the flow of requests is essential. Without rate limiting, a system can become vulnerable to malicious denial-of-service attempts, accidental overload from client scripts, resource starvation, and unexpected infrastructure costs.

In this walkthrough, we will unpack the mathematics and mechanics behind the **token-bucket algorithm**: a flexible strategy used in API gateways, networking systems, and service-protection layers. We will then build clear, runnable reference implementations in both **Python** and **Go**, discuss their trade-offs, and review what would need to change before using this pattern in a distributed production system.

## The Problem Statement: Why Rate Limiting Matters

At its core, a rate limiter is a traffic control mechanism. It evaluates incoming requests against a configured policy and decides whether to forward them to the downstream application or reject them, commonly with the HTTP status code `429 Too Many Requests`.

Without robust rate limiting, web applications face several practical risks:

1. **Resource starvation:** A poorly optimized loop from a client script can saturate database connections, exhaust CPU cycles, or consume worker threads, degrading the service for other users.
2. **Denial of service:** Malicious actors can flood expensive endpoints, such as search, authentication, file processing, or cryptographic operations, to overload application nodes.
3. **Cost control:** In cloud environments, unthrottled traffic does not just risk downtime; it can also increase infrastructure, logging, queueing, and third-party API costs.

The engineering challenge is to enforce these limits with minimal latency overhead. Every request must pass through the rate limiter before reaching the application logic, so the limiter should perform only a small amount of work per request.

## The Token-Bucket Algorithm Explained

The token-bucket algorithm relies on a simple metaphor: a bucket with a fixed capacity that stores tokens.

### Core Mechanics

1. **The bucket:** The bucket holds up to a maximum of $B$ tokens. It commonly starts full.
2. **The refill:** Tokens are added to the bucket at a constant refill rate of $R$ tokens per second. If the bucket is already full, extra tokens are discarded.
3. **The consumption:** When a request arrives, the system tries to consume a required number of tokens, usually one token per request.
4. **The decision:** If enough tokens are available, the request is allowed and the tokens are subtracted. If not, the request is rejected immediately.

The key benefit of token bucket is that it allows **controlled bursts**. A client can briefly send requests faster than the refill rate, as long as it has accumulated enough tokens. Over time, however, the average request rate is still constrained by the refill rate.

### Architectural Diagram

{% include figure.html
   src=page.image
   alt=page.image_alt
   caption="Visual breakdown of the high-level token-bucket system architecture, illustrating request flow, token consumption, and refill mechanics. The diagram was generated with Google's Gemini for illustrative purposes by the author using the contents of this post as the generation prompt."
%}

### Naive vs. Lazy Refills

A naive approach might run a background timer that increments tokens every second. That can work for a small number of buckets, but it scales poorly when managing many users, API keys, IP addresses, or tenants. Maintaining active timers for millions of independent buckets would waste memory and CPU.

Production-oriented systems usually prefer a **lazy refill strategy**. Instead of updating each bucket on a timer, the bucket calculates its current token count only when a request arrives.

By storing the timestamp of the last update, $T_{last}$, the limiter can compute the elapsed time:

$$
\Delta T = T_{current} - T_{last}
$$

Then it can compute the new token balance:

$$
\text{Tokens}_{new} = \min(B, \text{Tokens}_{old} + \Delta T \times R)
$$

This turns the refill step into a small amount of arithmetic performed inline with the request lifecycle.

## Python Implementation

Below is a complete, runnable Python implementation using `threading.Lock`.

This version is thread-safe within a single Python process. That means it can safely protect its in-memory bucket map when multiple threads access the same limiter instance. However, it does **not** coordinate limits across multiple worker processes, containers, or servers. For that, the bucket state usually needs to move into a shared external store such as Redis.

```python
import threading
import time
from typing import Dict, Tuple


class TokenBucketRateLimiter:
    """
    A thread-safe, in-memory token-bucket rate limiter using lazy refills.

    This implementation is intended as a clear reference example. It is safe
    within a single Python process, but it is not distributed across multiple
    processes or servers.
    """

    def __init__(self, capacity: float, refill_rate: float):
        if capacity <= 0:
            raise ValueError("capacity must be positive")
        if refill_rate <= 0:
            raise ValueError("refill_rate must be positive")

        self.capacity = float(capacity)
        self.refill_rate = float(refill_rate)

        # In-memory storage:
        # key -> (current token count, last updated monotonic timestamp)
        self.buckets: Dict[str, Tuple[float, float]] = {}
        self.lock = threading.Lock()

    def _refill(
        self,
        current_tokens: float,
        last_update: float,
        now: float
    ) -> float:
        elapsed = now - last_update
        refilled_tokens = current_tokens + (elapsed * self.refill_rate)
        return min(self.capacity, refilled_tokens)

    def allow_request(self, key: str, tokens_requested: float = 1.0) -> bool:
        if tokens_requested <= 0:
            raise ValueError("tokens_requested must be positive")
        if tokens_requested > self.capacity:
            return False

        # Use a monotonic clock for elapsed-time calculations.
        # Unlike time.time(), time.monotonic() is not affected by system clock changes.
        now = time.monotonic()

        with self.lock:
            if key not in self.buckets:
                self.buckets[key] = (self.capacity, now)

            current_tokens, last_update = self.buckets[key]
            updated_tokens = self._refill(current_tokens, last_update, now)

            if updated_tokens >= tokens_requested:
                self.buckets[key] = (updated_tokens - tokens_requested, now)
                return True

            # Store the refilled balance even when the request is rejected.
            self.buckets[key] = (updated_tokens, now)
            return False


if __name__ == "__main__":
    # Capacity of 5 tokens, refilling at 2 tokens per second.
    limiter = TokenBucketRateLimiter(capacity=5.0, refill_rate=2.0)
    user_id = "user_908a"

    print("--- Bursting Initial Capacity ---")
    for i in range(1, 8):
        allowed = limiter.allow_request(user_id)
        status = "ALLOWED" if allowed else "REJECTED (429)"
        print(f"Request {i}: {status}")

    print("\n--- Waiting 1.5 Seconds for Refill ---")
    time.sleep(1.5)

    for i in range(1, 4):
        allowed = limiter.allow_request(user_id)
        status = "ALLOWED" if allowed else "REJECTED (429)"
        print(f"Subsequent Request {i}: {status}")
````

This implementation favors clarity over maximum throughput. The single global lock makes the dictionary safe, but it also means requests for unrelated users still serialize through the same lock. For a high-throughput in-memory implementation, one improvement would be **lock striping**, where keys are partitioned across multiple locks.

## Go Implementation

Go is well suited for highly concurrent services. In the implementation below, a limiter-level `sync.RWMutex` protects the shared client map, while each bucket has its own `sync.Mutex` for token updates. This means bucket creation still uses a shared map lock, but normal request evaluation for existing buckets localizes contention to the specific client bucket.

```go
package main

import (
	"fmt"
	"math"
	"sync"
	"time"
)

// Bucket represents an individual client's token state.
type Bucket struct {
	tokens     float64
	lastUpdate time.Time
	mu         sync.Mutex
}

// TokenBucketLimiter manages multiple client buckets safely.
type TokenBucketLimiter struct {
	sync.RWMutex
	capacity   float64
	refillRate float64
	clients    map[string]*Bucket
}

// NewTokenBucketLimiter creates a new token-bucket limiter.
func NewTokenBucketLimiter(capacity, refillRate float64) (*TokenBucketLimiter, error) {
	if capacity <= 0 {
		return nil, fmt.Errorf("capacity must be positive")
	}
	if refillRate <= 0 {
		return nil, fmt.Errorf("refillRate must be positive")
	}

	return &TokenBucketLimiter{
		capacity:   capacity,
		refillRate: refillRate,
		clients:    make(map[string]*Bucket),
	}, nil
}

// getBucket retrieves or creates a client bucket safely.
func (tbl *TokenBucketLimiter) getBucket(key string) *Bucket {
	tbl.RLock()
	bucket, exists := tbl.clients[key]
	tbl.RUnlock()

	if exists {
		return bucket
	}

	tbl.Lock()
	defer tbl.Unlock()

	// Double-check to avoid creating duplicate buckets if another goroutine
	// inserted the same key while this goroutine was waiting for the write lock.
	if bucket, exists = tbl.clients[key]; !exists {
		bucket = &Bucket{
			tokens:     tbl.capacity,
			lastUpdate: time.Now(),
		}
		tbl.clients[key] = bucket
	}

	return bucket
}

// AllowRequest checks whether a specific client can consume tokens.
func (tbl *TokenBucketLimiter) AllowRequest(key string, tokensRequested float64) bool {
	if tokensRequested <= 0 {
		return false
	}
	if tokensRequested > tbl.capacity {
		return false
	}

	bucket := tbl.getBucket(key)

	bucket.mu.Lock()
	defer bucket.mu.Unlock()

	now := time.Now()
	elapsed := now.Sub(bucket.lastUpdate).Seconds()

	bucket.tokens = math.Min(
		tbl.capacity,
		bucket.tokens+(elapsed*tbl.refillRate),
	)
	bucket.lastUpdate = now

	if bucket.tokens >= tokensRequested {
		bucket.tokens -= tokensRequested
		return true
	}

	return false
}

func main() {
	// Capacity: 5 tokens. Refill rate: 2 tokens per second.
	limiter, err := NewTokenBucketLimiter(5.0, 2.0)
	if err != nil {
		panic(err)
	}

	clientID := "client_441b"

	fmt.Println("--- Bursting Initial Capacity ---")
	for i := 1; i <= 7; i++ {
		allowed := limiter.AllowRequest(clientID, 1.0)

		status := "REJECTED (429)"
		if allowed {
			status = "ALLOWED"
		}

		fmt.Printf("Request %d: %s\n", i, status)
	}

	fmt.Println("\n--- Waiting 1.5 Seconds for Refill ---")
	time.Sleep(1500 * time.Millisecond)

	for i := 1; i <= 3; i++ {
		allowed := limiter.AllowRequest(clientID, 1.0)

		status := "REJECTED (429)"
		if allowed {
			status = "ALLOWED"
		}

		fmt.Printf("Subsequent Request %d: %s\n", i, status)
	}
}
```

The Go version has better concurrency behavior than the simple Python version because requests for different existing clients do not all contend on a single global lock. However, it is still an in-memory implementation. If a service runs across multiple machines, each instance would maintain its own independent bucket state unless the limiter is backed by a shared data store.

## Illustrative Benchmark Results

Benchmarks for rate limiters are sensitive to the benchmark harness, CPU, language runtime, lock contention pattern, and key distribution. A test where every request targets the same key measures hot-key lock contention. A test where requests are spread across many keys measures map access, bucket lookup, and per-key parallelism differently.

The table below shows an illustrative benchmark profile across $1{,}000{,}000$ request evaluations on a single machine. These numbers should be treated as demonstration data, not as universal performance claims.

```text
======================================================================
ILLUSTRATIVE BENCHMARK RUN: Python 3.11 vs Go 1.21
OS: Linux x86_64 | CPU: AMD Ryzen 7 5800X (8 cores, 16 threads)
======================================================================

Scenario:
- 1,000,000 token-bucket evaluations
- In-memory state
- One token requested per operation
- Buckets already initialized
- No network or external datastore calls

Type             Total Ops    Total Time    Mean Latency / Op
----------------------------------------------------------------------
Python (Lock)    1,000,000    1.442 sec     1.442 μs
Go (Mutex)       1,000,000    0.084 sec     0.084 μs

Detailed Latency Percentiles:
----------------------------------------------------------------------
Metric           P50 (Median)     P95              P99
Python           1.25 μs          2.10 μs          4.80 μs
Go               0.06 μs          0.14 μs          0.31 μs

Interpretation:
Go is expected to outperform Python for this kind of tight, lock-heavy,
CPU-local loop because of compiled execution, lower runtime overhead,
and cheaper synchronization primitives. The exact ratio should not be
generalized without measuring your own workload.
```

The key lesson is not that one language is always better than another. The more important point is that the cost of the rate limiter should remain small compared with the work it protects. If the limiter requires a network call to Redis, for example, the external round trip will usually dominate the cost of the local arithmetic.

## Complexity Analysis

The implementation's request-time footprint remains small because of the lazy-refill strategy described earlier.

{% include table-caption.html
caption="Complexity profile for token-bucket request evaluation and memory growth."
id="tbl-token-bucket-complexity"
%}

| Operation / Space      | Time Complexity  | Space Complexity | Architectural Profile                                                                                                                    |
| ---------------------- | ---------------- | ---------------- | ---------------------------------------------------------------------------------------------------------------------------------------- |
| **Request evaluation** | $\mathcal{O}(1)$ | $\mathcal{O}(1)$ | A fixed amount of arithmetic, timestamp comparison, and state update per request.                                                        |
| **Bucket storage**     | —                | $\mathcal{O}(N)$ | Memory grows linearly with the number of unique tracked identifiers, where $N$ is the number of active clients, users, IPs, or API keys. |
{: .c-prose-table }

The algorithmic complexity is attractive because each request does not require scanning history or storing every previous request. Unlike a naive log-based limiter, token bucket only needs the current token count and the last update time for each tracked key.

## Edge Cases and Gotchas

When scaling a token-bucket implementation into a larger distributed system, several important issues appear.

1. **Distributed state synchronization:** In-memory implementations are limited to one process or one server. If an application runs behind a load balancer across multiple nodes, the same user's requests may hit different instances. This can accidentally multiply the effective limit by the number of instances. A common solution is to store bucket state in a shared low-latency datastore such as Redis and update it atomically.

2. **Clock behavior:** Lazy refill depends on elapsed time. In Python, `time.monotonic()` is safer than `time.time()` for local elapsed-time calculations because it is not affected by wall-clock adjustments. In distributed systems, clock consistency still matters when multiple machines participate in rate-limit decisions.

3. **Lock contention:** The Python implementation uses a single global lock, so requests for different users still wait behind the same mutex. For higher throughput, you can partition keys across multiple locks or use a per-key locking strategy. The Go implementation demonstrates one version of this idea by using a per-bucket mutex after the bucket has been created.

4. **Unbounded memory growth:** A limiter that stores one bucket per user, IP address, or API key needs a cleanup policy. Otherwise, old inactive keys can accumulate forever. Production systems usually add expiration, least-recently-used eviction, or datastore-level TTLs.

5. **Atomic updates in shared stores:** If bucket state is stored in Redis or another external system, the read-modify-write operation must be atomic. Otherwise, concurrent requests can observe the same token balance and both be allowed incorrectly. Redis Lua scripts or transactions are common ways to make the update atomic.

6. **Choosing the right key:** The limiter is only as good as the identifier it tracks. Limiting by IP address can be useful, but it may unfairly group users behind the same NAT or corporate proxy. Limiting by authenticated user ID or API key is often more precise.

7. **Choosing the right response:** For HTTP APIs, rejected requests commonly return `429 Too Many Requests`. It is also useful to include headers such as `Retry-After` or rate-limit metadata so clients can back off gracefully.

## Token Bucket vs. Other Rate-Limiting Strategies

Token bucket is flexible, but it is not the only rate-limiting algorithm.

{% include table-caption.html
caption="Comparison of common rate-limiting strategies."
id="tbl-rate-limiting-strategies"
%}

| Strategy                   | Allows Bursts?                  | Memory Use | Notes                                                                  |
| -------------------------- | ------------------------------- | ---------- | ---------------------------------------------------------------------- |
| **Fixed window counter**   | Yes, but unevenly at boundaries | Low        | Simple, but can allow double bursts around window edges.               |
| **Sliding window log**     | More precise                    | High       | Stores request timestamps; accurate but memory-heavy for high traffic. |
| **Sliding window counter** | Partially                       | Medium     | Smoother than fixed windows, cheaper than full logs.                   |
| **Leaky bucket**           | Usually no                      | Low        | Smooths traffic into a steady output rate.                             |
| **Token bucket**           | Yes                             | Low        | Allows controlled bursts while enforcing a long-term average rate.     |
{: .c-prose-table }

Token bucket is a strong default when you want to allow short bursts without losing control over the long-term request rate. For example, a user might be allowed to make 100 requests immediately after being idle, but over time still be limited to 10 requests per second.

## Further Reading

To deepen your systems design understanding, explore these resources:

* [Stripe Engineering: Scaling your API with rate limiters](https://stripe.com/blog/rate-limiters)
* [RFC 6585: Additional HTTP Status Codes](https://datatracker.ietf.org/doc/html/rfc6585)
* [Redis documentation: Programmability with Lua scripting](https://redis.io/docs/latest/develop/programmability/eval-intro/)
* [Go documentation: Package sync](https://pkg.go.dev/sync)
* [Python documentation: time — Time access and conversions](https://docs.python.org/3/library/time.html)
