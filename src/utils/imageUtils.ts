/**
 * Utility to convert an image File to a Base64 data URL,
 * with automatic client-side resizing and compression to prevent 413 (Payload Too Large) errors.
 */
export function fileToBase64(file: File, maxDimension = 1920, quality = 0.85): Promise<string> {
  return new Promise((resolve, reject) => {
    // If it's an SVG or already tiny, read directly
    if (file.type === "image/svg+xml" || file.size < 250 * 1024) {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
      return;
    }

    const img = new Image();
    const objectUrl = URL.createObjectURL(file);
    img.src = objectUrl;

    img.onload = () => {
      URL.revokeObjectURL(objectUrl);
      let { width, height } = img;

      if (width > maxDimension || height > maxDimension) {
        if (width > height) {
          height = Math.round((height * maxDimension) / width);
          width = maxDimension;
        } else {
          width = Math.round((width * maxDimension) / height);
          height = maxDimension;
        }
      }

      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext("2d");

      if (!ctx) {
        // Fallback to standard base64 if canvas context is unavailable
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = (error) => reject(error);
        return;
      }

      ctx.drawImage(img, 0, 0, width, height);
      // Use JPEG compression for photographic images, otherwise preserve PNG format
      const outputFormat = file.type === "image/png" ? "image/jpeg" : file.type;
      resolve(canvas.toDataURL(outputFormat, quality));
    };

    img.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    };
  });
}
