#!/usr/bin/env python3
"""
Simple icon generator for LiteChatGPT
Creates basic PNG icons if you have PIL/Pillow installed

Usage: python generate-icons.py

If you don't have Pillow installed:
    pip install Pillow

Alternative: Open icons/icon-generator.html in your browser instead
"""

try:
    from PIL import Image, ImageDraw, ImageFont
    import os
except ImportError:
    print("Error: Pillow library not found")
    print("Please install it with: pip install Pillow")
    print("\nAlternatively, open icons/icon-generator.html in your web browser")
    exit(1)

def create_icon(size):
    """Create a simple gradient icon with lightning emoji"""

    # Create image with gradient background
    img = Image.new('RGB', (size, size), color='white')
    draw = ImageDraw.Draw(img)

    # Draw gradient background (purple gradient)
    for y in range(size):
        # Interpolate between two colors
        r = int(102 + (118 - 102) * y / size)
        g = int(126 + (75 - 126) * y / size)
        b = int(234 + (162 - 234) * y / size)
        draw.rectangle([0, y, size, y+1], fill=(r, g, b))

    # Try to draw lightning emoji (might not work on all systems)
    try:
        font_size = int(size * 0.6)
        # Try to use a font that supports emoji
        try:
            font = ImageFont.truetype("seguiemj.ttf", font_size)  # Windows emoji font
        except:
            try:
                font = ImageFont.truetype("AppleColorEmoji.ttc", font_size)  # macOS
            except:
                # Fallback to default font, draw "L" instead
                font = ImageFont.load_default()
                draw.text((size//2, size//2), "L", fill='white', anchor='mm', font=font)
                return img

        draw.text((size//2, size//2), "⚡", fill='white', anchor='mm', font=font)
    except Exception as e:
        # Fallback: draw a simple "L" letter
        try:
            font_size = int(size * 0.5)
            font = ImageFont.truetype("arial.ttf", font_size)
        except:
            font = ImageFont.load_default()

        draw.text((size//2, size//2), "L", fill='white', anchor='mm', font=font)

    return img

def main():
    """Generate all required icon sizes"""

    icons_dir = os.path.join(os.path.dirname(__file__), 'icons')

    sizes = [16, 48, 128]

    print("Generating LiteChatGPT icons...")

    for size in sizes:
        filename = f"icon{size}.png"
        filepath = os.path.join(icons_dir, filename)

        print(f"Creating {filename} ({size}x{size})...")
        icon = create_icon(size)
        icon.save(filepath, 'PNG')
        print(f"✓ Saved to {filepath}")

    print("\n✅ All icons generated successfully!")
    print("You can now load the extension in Chrome.")

if __name__ == "__main__":
    main()
