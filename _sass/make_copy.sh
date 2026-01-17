for file in */*; do
    if [ -f "$file" ]; then
        # Replace the slash with an underscore for the new filename
        newname=$(echo "$file" | sed 's/\//_/g')
        cp "$file" "../$newname"
    fi
done
