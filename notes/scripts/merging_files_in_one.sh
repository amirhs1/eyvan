#!/bin/bash

# Name of the output file
OUTPUT="combined_styles.scss"

# Clear the output file if it already exists
> "$OUTPUT"

echo "Starting concatenation..."

# Loop through directories that start with a digit (0-7)
for dir in [0-9]*/ ; do
    # Remove the trailing slash for the header name
    dir_name=$(basename "$dir")

    # Add Folder Header
    echo "/* ==========================================================================" >> "$OUTPUT"
    echo "   FOLDER: $dir_name" >> "$OUTPUT"
    echo "   ========================================================================== */" >> "$OUTPUT"
    echo "" >> "$OUTPUT"

    # Loop through all .scss files within that directory
    for file in "$dir"*.scss; do
        # Check if the file exists to avoid errors in empty folders
        if [ -f "$file" ]; then
            filename=$(basename "$file")
            
            # Add File Header
            echo "/* --- File: $filename --- */" >> "$OUTPUT"
            
            # Append the file content
            cat "$file" >> "$OUTPUT"
            
            # Add two newlines for clean separation between files
            echo -e "\n\n" >> "$OUTPUT"
        fi
    done
done

echo "Done! All files combined into $OUTPUT"