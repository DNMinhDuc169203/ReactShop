import React, { useState, useEffect } from 'react';

const Image = ({ src, alt, className }) => {
  const [isError, setIsError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  // Reset states when src changes
  useEffect(() => {
    setIsError(false);
    setIsLoading(true);
    // Thêm log để debug
    console.log("Image src changed:", src);
  }, [src]);

  const handleError = () => {
    console.log("Image failed to load:", src);
    setIsError(true);
    setIsLoading(false);
  };

  const handleLoad = () => {
    console.log("Image loaded successfully:", src);
    setIsLoading(false);
  };

  return (
    <div className={`relative ${className}`}>
      {isLoading && (
        <div className="absolute inset-0 bg-gray-200 animate-pulse rounded-md" />
      )}
      <img
        src={isError ? 'https://via.placeholder.com/400x300?text=Không+có+ảnh' : src}
        alt={alt || "Product image"}
        className={`w-full h-full object-cover rounded-md ${isError ? 'opacity-60' : ''}`}
        onError={handleError}
        onLoad={handleLoad}
        loading="lazy"
      />
    </div>
  );
};

export default Image;