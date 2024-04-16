import os
import json
import sys

# Check if the user has provided a path argument
if len(sys.argv) < 2:
  print("Usage: python3 get-assets-to-json.py [path_to_directory]")
  sys.exit(1)

# Set the root path from the command line argument
root_path = sys.argv[1]

# Define image extensions you expect to encounter
image_extensions = {'.jpg', '.jpeg', '.png', '.gif', '.bmp'}

# Initialize data from existing JSON file if it exists
try:
  with open('_assets.json', 'r') as f:
    data = json.load(f)
except FileNotFoundError:
  data = []

# Create a mapping from categories to their existing records for easy update
category_map = {item['category']: item for item in data}

# Walk through the directory structure
for subdir, dirs, files in os.walk(root_path):
  category_name = os.path.basename(subdir)
  # Check if we are not at the root directory level
  if category_name != os.path.basename(root_path):
    # Sort files first before creating references
    sorted_files = sorted([file for file in files if os.path.splitext(file)[1].lower() in image_extensions])
    new_references = [{"file": file} for file in sorted_files]

    if category_name in category_map:
      # Update existing category
      existing_refs = {ref['file'] for ref in category_map[category_name]['references']}
      new_files_set = {ref['file'] for ref in new_references}

      # Files to potentially remove
      files_to_remove = existing_refs - new_files_set
      updated_refs = [ref for ref in category_map[category_name]['references'] if ref['file'] not in files_to_remove]

      # Files to add
      files_to_add = new_files_set - existing_refs
      updated_refs.extend({'file': file} for file in files_to_add)

      # Sort updated references before assigning
      updated_refs_sorted = sorted(updated_refs, key=lambda x: x['file'])
      category_map[category_name]['references'] = updated_refs_sorted
    else:
      # Add new category
      data.append({
        "category": category_name,
        "references": new_references
      })

# Convert the updated list to a sorted list based on the category
sorted_data = sorted(data, key=lambda x: x['category'])

# Convert the sorted list back to JSON
json_data = json.dumps(sorted_data, indent=2)

# Print or save the JSON data
print(json_data)

# Write the updated JSON data to the file
with open('_assets.json', 'w') as f:
  f.write(json_data)
