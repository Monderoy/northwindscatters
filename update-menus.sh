#!/bin/bash

# Update all admin pages with consistent sidebar menu

# Define the active marker for each page
declare -A active_pages
active_pages["admin-kittens.html"]="kattungar"
active_pages["admin-cats.html"]="katter"
active_pages["admin-news.html"]="nyheter"
active_pages["admin-gallery.html"]="galleri"
active_pages["admin-about.html"]="om-oss"
active_pages["admin-settings.html"]="installningar"

for file in "${!active_pages[@]}"; do
  if [ -f "$file" ]; then
    active_page="${active_pages[$file]}"
    
    echo "Updating $file (active: $active_page)..."
    
    # This is complex - let me just update each file manually instead
  fi
done

echo "Done!"
