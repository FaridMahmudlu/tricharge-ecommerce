# How to Add Real Product Images

Currently, the website uses placeholder images from Picsum.photos. To replace these with actual product images of your 3-in-1 Wireless Charging Station, follow these steps:

## Image Preparation

1. Take high-quality photos of your product from multiple angles:
   - Front view
   - Side view
   - Top view
   - With devices being charged (show phone, watch, and earbuds)
   - Close-up of features
   - In use on a desk

2. Ensure photos have good lighting and are at least 1200px wide for optimal quality.

3. Edit your photos to:
   - Have a clean, white or light background
   - Maintain consistent aspect ratios
   - Show true colors
   - Optimize file size (use .jpg or .webp format)

## Adding Images to the Project

### Option 1: Host Images Locally

1. Create an `images` folder in `temp-frontend/public` directory.
2. Copy your prepared product images to this folder.
3. Update image paths in the code by replacing the placeholder URLs.

For example, in `src/data/products.ts`:
```js
export const products: Product[] = [
  {
    id: 1,
    name: "3-in-1 Wireless Charging Station",
    // Change this image path
    image: "/images/charging-station-main.jpg",
    // ...
  }
];
```

And in `src/pages/Home.tsx`, find the ProductImageGallery section and replace:
```jsx
<ProductImageGallery>
  {/* Replace these with actual product images */}
  <GalleryImage src="/images/charging-station-angle1.jpg" alt="Product view 1" />
  <GalleryImage src="/images/charging-station-angle2.jpg" alt="Product view 2" />
  <GalleryImage src="/images/charging-station-angle3.jpg" alt="Product view 3" />
  <GalleryImage src="/images/charging-station-angle4.jpg" alt="Product view 4" />
</ProductImageGallery>
```

### Option 2: Host Images Online

1. Upload your images to a cloud storage service (AWS S3, Cloudinary, Imgur, etc.)
2. Copy the direct URL to each image
3. Replace the placeholder URLs with your direct image URLs in the code

## Image Best Practices for E-commerce

- Include images showing the product in use
- Show scale with familiar objects
- Include multiple angles
- Make sure the images match the description
- Use consistent lighting and styling across all product images
- Consider adding a short video or animated GIF showing the charging process

## Need Help?

If you need help with product photography or image optimization, consider:
1. Hiring a professional photographer
2. Using AI-enhanced photo editing tools
3. Getting inspiration from similar product listings on major e-commerce sites 