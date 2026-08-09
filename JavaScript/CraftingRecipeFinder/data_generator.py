import os
import json
import zipfile
from pathlib import Path

def generate_recipes():
    # 1. Locate Minecraft folder (Works for Windows, Mac, Linux)
    if os.name == 'nt': # Windows
        mc_path = Path(os.getenv('APPDATA')) / ".minecraft/versions"
    elif os.uname().sysname == 'Darwin': # Mac
        mc_path = Path.home() / "Library/Application Support/minecraft/versions"
    else: # Linux
        mc_path = Path.home() / ".minecraft/versions"

    if not mc_path.exists():
        print("Error: Could not find Minecraft installation.")
        return

    # 2. Find the latest version installed
    versions = sorted([d for d in mc_path.iterdir() if d.is_dir()], reverse=True)
    if not versions:
        print("No versions found.")
        return
    
    latest_ver = versions[0]
    jar_path = latest_ver / f"{latest_ver.name}.jar"
    
    print(f"Extracting recipes from Minecraft {latest_ver.name}...")

    all_recipes = []

    # 3. Open the JAR (it's just a zip file) and extract recipes
    try:
        with zipfile.ZipFile(jar_path, 'r') as jar:
            # In 1.21+, recipes are in data/minecraft/recipe/
            recipe_files = [f for f in jar.namelist() if "data/minecraft/recipe/" in f and f.endswith(".json")]
            
            for file_path in recipe_files:
                with jar.open(file_path) as f:
                    try:
                        data = json.load(f)
                        # Clean up the name for the UI
                        name = file_path.split('/')[-1].replace('.json', '').replace('_', ' ')
                        data['display_name'] = name.title()
                        all_recipes.append(data)
                    except:
                        continue
                        
        # 4. Automatically create and write the JSON file
        with open('recipes.json', 'w') as out:
            json.dump(all_recipes, out, indent=4)
            
        print(f"Done! Created 'recipes.json' with {len(all_recipes)} recipes.")
        
    except Exception as e:
        print(f"Failed: {e}")

if __name__ == "__main__":
    generate_recipes()
