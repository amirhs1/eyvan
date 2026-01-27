#!/bin/bash

# Define the input file containing the list
INPUT_FILE="list.txt"

# Check if the input file exists
if [[ ! -f "$INPUT_FILE" ]]; then
    echo "Error: $INPUT_FILE not found!"
    exit 1
fi

echo "Starting downloads..."

# Read the file line by line
while read -r target_name url || [ -n "$target_name" ]; do
    # Skip empty lines
    [[ -z "$target_name" || -z "$url" ]] && continue

    echo "Downloading: $target_name"
    
    # -L follows redirects
    # -o specifies the output filename
    # --silent hides the progress bar (optional)
    curl -L "$url" -o "$target_name" --silent

    if [[ $? -eq 0 ]]; then
        echo "Successfully saved $target_name"
    else
        echo "Error: Failed to download $target_name"
    fi
    
    # Adding a tiny sleep to be polite to the server
    sleep 0.1

done < "$INPUT_FILE"

echo "All downloads complete!"