#!/bin/bash

# Loop through each directory starting with a digit
for dir in [0-9]*/ ; do
    # Remove trailing slash and get the folder name
    dir_name=$(basename "$dir")
    
    # Define the output file name based on the folder
    OUTPUT_FILE="${dir_name}.scss"
    
    # Determine the description based on ITCSS layer
    case $dir_name in
        0-settings*)  DESC="Global variables, site-wide settings, and config switches." ;;
        1-tools*)     DESC="Global mixins and functions." ;;
        2-generic*)   DESC="Ground-level styles like Resets or Normalize.scss." ;;
        3-base*)      DESC="Unclassed HTML elements (h1, a, etc.)." ;;
        4-objects*)   DESC="Class-based selectors which adhere to OOCSS (e.g., .layout)." ;;
        5-components*) DESC="Specific UI components and chunks of UI." ;;
        6-layouts*)    DESC="Page-specific layouts or structural wrappers." ;;
        7-trumps*)     DESC="High-priority overrides and utility classes." ;;
        *)             DESC="Additional project-specific styles." ;;
    esac

    # Initialize/Clear the file and add the Folder Header
    echo "/* ==========================================================================" > "$OUTPUT_FILE"
    echo "   LAYER: $dir_name" >> "$OUTPUT_FILE"
    echo "   DESC:  $DESC" >> "$OUTPUT_FILE"
    echo "   ========================================================================== */" >> "$OUTPUT_FILE"
    echo "" >> "$OUTPUT_FILE"

    # Loop through SCSS files inside the directory
    for file in "$dir"*.scss; do
        if [ -f "$file" ]; then
            filename=$(basename "$file")
            
            # Add Sub-file Header
            echo "/* --- Sub-file: $filename --- */" >> "$OUTPUT_FILE"
            
            # Append content
            cat "$file" >> "$OUTPUT_FILE"
            
            # Add spacing
            echo -e "\n" >> "$OUTPUT_FILE"
        fi
    done

    echo "Created: $OUTPUT_FILE"
done

echo "Success! All folders processed."