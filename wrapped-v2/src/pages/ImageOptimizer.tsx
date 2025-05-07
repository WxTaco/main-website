import { useState, useRef, useEffect } from 'react';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';


interface ImageFile {
  file: File;
  preview: string;
  optimizedPreview?: string;
  optimizedSize?: number;
  originalSize: number;
  width?: number;
  height?: number;
  isOptimized?: boolean;
}

interface BatchImageFile extends ImageFile {
  id: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  progress: number;
}

interface BatchProcessingOptions {
  quality: number;
  format: 'jpeg' | 'png' | 'webp';
  maxWidth: number;
  maxHeight: number;
  filter: string;
}

interface NotificationProps {
  message: string;
  content: string;
  isVisible: boolean;
}

interface FilterOption {
  id: string;
  name: string;
  description: string;
  apply: (ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement) => void;
}

interface PresetOption {
  id: string;
  name: string;
  description: string;
  quality: number;
  format: 'jpeg' | 'png' | 'webp';
  resize: boolean;
  maxWidth: number;
  maxHeight: number;
}


export const Notification: React.FC<NotificationProps> = ({ message, content, isVisible }) => {
  return (
    <div
      className={`fixed bottom-8 right-8 bg-gray-800 text-white p-4 rounded-lg shadow-lg border border-theme-primary transition-all duration-300 z-50 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10 pointer-events-none'
      }`}
    >
      <div className="flex items-start">
        <div className="bg-green-500 rounded-full p-1 mr-3">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <div>
          <p className="font-medium">{message}</p>
          <p className="text-sm text-gray-300 mt-1">{content}</p>
        </div>
      </div>
    </div>
  );
};

const filterOptions: FilterOption[] = [
  {
    id: 'none',
    name: 'None',
    description: 'No filter applied',
    apply: (_ctx, _canvas) => {
    }
  },
  {
    id: 'grayscale',
    name: 'Grayscale',
    description: 'Convert image to black and white',
    apply: (ctx, canvas) => {
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imageData.data;

      for (let i = 0; i < data.length; i += 4) {
        const avg = (data[i] + data[i + 1] + data[i + 2]) / 3;
        data[i] = avg;
        data[i + 1] = avg;
        data[i + 2] = avg;
      }

      ctx.putImageData(imageData, 0, 0);
    }
  },
  {
    id: 'sepia',
    name: 'Sepia',
    description: 'Apply a vintage sepia tone',
    apply: (ctx, canvas) => {
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imageData.data;

      for (let i = 0; i < data.length; i += 4) {
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];

        data[i] = Math.min(255, (r * 0.393) + (g * 0.769) + (b * 0.189));     
        data[i + 1] = Math.min(255, (r * 0.349) + (g * 0.686) + (b * 0.168)); 
        data[i + 2] = Math.min(255, (r * 0.272) + (g * 0.534) + (b * 0.131)); 
      }

      ctx.putImageData(imageData, 0, 0);
    }
  },
  {
    id: 'invert',
    name: 'Invert',
    description: 'Invert all colors',
    apply: (ctx, canvas) => {
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imageData.data;

      for (let i = 0; i < data.length; i += 4) {
        data[i] = 255 - data[i];
        data[i + 1] = 255 - data[i + 1];
        data[i + 2] = 255 - data[i + 2];
      }

      ctx.putImageData(imageData, 0, 0);
    }
  },
  {
    id: 'brightness',
    name: 'Brighten',
    description: 'Increase brightness by 20%',
    apply: (ctx, canvas) => {
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imageData.data;
      const brightness = 50;

      for (let i = 0; i < data.length; i += 4) {
        data[i] = Math.min(255, data[i] + brightness);        
        data[i + 1] = Math.min(255, data[i + 1] + brightness);
        data[i + 2] = Math.min(255, data[i + 2] + brightness);
      }

      ctx.putImageData(imageData, 0, 0);
    }
  },
  {
    id: 'contrast',
    name: 'Increase Contrast',
    description: 'Enhance image contrast',
    apply: (ctx, canvas) => {
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imageData.data;
      const factor = 1.5;

      for (let i = 0; i < data.length; i += 4) {
        data[i] = Math.min(255, Math.max(0, 128 + (data[i] - 128) * factor));        
        data[i + 1] = Math.min(255, Math.max(0, 128 + (data[i + 1] - 128) * factor));
        data[i + 2] = Math.min(255, Math.max(0, 128 + (data[i + 2] - 128) * factor));
      }

      ctx.putImageData(imageData, 0, 0);
    }
  },
  {
    id: 'blur',
    name: 'Blur',
    description: 'Apply a slight blur effect',
    apply: (ctx, canvas) => {
      ctx.filter = 'blur(2px)';
      const tempCanvas = document.createElement('canvas');
      tempCanvas.width = canvas.width;
      tempCanvas.height = canvas.height;
      const tempCtx = tempCanvas.getContext('2d');

      if (tempCtx) {
        tempCtx.drawImage(canvas, 0, 0);
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(tempCanvas, 0, 0);
      }

      ctx.filter = 'none';
    }
  },
  {
    id: 'sharpen',
    name: 'Sharpen',
    description: 'Enhance image details',
    apply: (ctx, canvas) => {
      ctx.filter = 'contrast(1.5) brightness(0.9)';
      const tempCanvas = document.createElement('canvas');
      tempCanvas.width = canvas.width;
      tempCanvas.height = canvas.height;
      const tempCtx = tempCanvas.getContext('2d');

      if (tempCtx) {
        tempCtx.drawImage(canvas, 0, 0);
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(tempCanvas, 0, 0);
      }

      ctx.filter = 'none';
    }
  }
];

const presetOptions: PresetOption[] = [
  {
    id: 'custom',
    name: 'Custom',
    description: 'Your custom settings',
    quality: 80,
    format: 'jpeg',
    resize: true,
    maxWidth: 1920,
    maxHeight: 1080
  },
  {
    id: 'web',
    name: 'Web Optimized',
    description: 'Best for websites (balanced quality/size)',
    quality: 75,
    format: 'webp',
    resize: true,
    maxWidth: 1600,
    maxHeight: 1200
  },
  {
    id: 'social',
    name: 'Social Media',
    description: 'Optimized for social platforms',
    quality: 85,
    format: 'jpeg',
    resize: true,
    maxWidth: 1200,
    maxHeight: 1200
  },
  {
    id: 'email',
    name: 'Email/Messaging',
    description: 'Small file size for sharing',
    quality: 60,
    format: 'jpeg',
    resize: true,
    maxWidth: 800,
    maxHeight: 800
  },
  {
    id: 'print',
    name: 'Print Quality',
    description: 'High quality for printing',
    quality: 95,
    format: 'png',
    resize: true,
    maxWidth: 3000,
    maxHeight: 3000
  },
  {
    id: 'thumbnail',
    name: 'Thumbnail',
    description: 'Small preview images',
    quality: 70,
    format: 'jpeg',
    resize: true,
    maxWidth: 400,
    maxHeight: 400
  }
];

const ImageOptimizer = () => {
  const [image, setImage] = useState<ImageFile | null>(null);
  const [quality, setQuality] = useState<number>(80);
  const [maxWidth, setMaxWidth] = useState<number>(1920);
  const [maxHeight, setMaxHeight] = useState<number>(1080);
  const [format, setFormat] = useState<'jpeg' | 'png' | 'webp'>('jpeg');
  const [isOptimizing, setIsOptimizing] = useState<boolean>(false);
  const [notification, setNotification] = useState<{ message: string; content: string; isVisible: boolean }>({
    message: '',
    content: '',
    isVisible: false
  });
  const [selectedFilter, setSelectedFilter] = useState<string>('none');
  const [selectedPreset, setSelectedPreset] = useState<string>('custom');
  const [maintainAspectRatio, setMaintainAspectRatio] = useState<boolean>(true);
  const [compressionHistory, setCompressionHistory] = useState<{original: number, optimized: number, date: Date, isOptimized: boolean}[]>([]);
  const [showAdvancedOptions, setShowAdvancedOptions] = useState<boolean>(false);

 
  const [batchMode, setBatchMode] = useState<boolean>(false);
  const [batchImages, setBatchImages] = useState<BatchImageFile[]>([]);
  const [isBatchProcessing, setIsBatchProcessing] = useState<boolean>(false);
  const [batchProgress, setBatchProgress] = useState<number>(0);
  const [batchCompleted, setBatchCompleted] = useState<number>(0);
  const [batchOptions, setBatchOptions] = useState<BatchProcessingOptions>({
    quality,
    format,
    maxWidth,
    maxHeight,
    filter: selectedFilter
  });

  const notificationTimerRef = useRef<NodeJS.Timeout | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const batchCanvasRef = useRef<HTMLCanvasElement | null>(null);

  const showNotification = (message: string, content: string) => {
    if (notificationTimerRef.current) {
      clearTimeout(notificationTimerRef.current);
    }

    setNotification({
      message,
      content,
      isVisible: true
    });

    notificationTimerRef.current = setTimeout(() => {
      setNotification(prev => ({ ...prev, isVisible: false }));
    }, 3000);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const file = files[0];

      if (!file.type.startsWith('image/')) {
        showNotification('Error', 'Please upload an image file (JPEG, PNG, etc.)');
        return;
      }

      const reader = new FileReader();
      reader.onload = () => {
        setImage({
          file,
          preview: reader.result as string,
          originalSize: file.size
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const applyPreset = (presetId: string) => {
    const preset = presetOptions.find(p => p.id === presetId);
    if (!preset) return;

    setSelectedPreset(presetId);
    setQuality(preset.quality);
    setFormat(preset.format);
    setMaxWidth(preset.maxWidth);
    setMaxHeight(preset.maxHeight);
  };

  const handleDimensionChange = (dimension: 'width' | 'height', value: number) => {
    if (!image || !image.width || !image.height) return;

    if (dimension === 'width') {
      setMaxWidth(value);
      if (maintainAspectRatio) {
        const aspectRatio = image.height / image.width;
        setMaxHeight(Math.round(value * aspectRatio));
      }
    } else {
      setMaxHeight(value);
      if (maintainAspectRatio) {
        const aspectRatio = image.width / image.height;
        setMaxWidth(Math.round(value * aspectRatio));
      }
    }
  };

 
  const optimizeImage = () => {
    if (!image) return;

    setIsOptimizing(true);

    const img = new Image();
    img.onload = () => {
     
      const canvas = canvasRef.current;
      if (!canvas) return;

      const ctx = canvas.getContext('2d');
      if (!ctx) return;

     
      if (!image.width || !image.height) {
        setImage(prevImage => {
          if (prevImage) {
            return {
              ...prevImage,
              width: img.width,
              height: img.height
            };
          }
          return prevImage;
        });
      }

     
      let newWidth = img.width;
      let newHeight = img.height;

      if (newWidth > maxWidth) {
        newHeight = (maxWidth / newWidth) * newHeight;
        newWidth = maxWidth;
      }

      if (newHeight > maxHeight) {
        newWidth = (maxHeight / newHeight) * newWidth;
        newHeight = maxHeight;
      }

     
      canvas.width = newWidth;
      canvas.height = newHeight;

     
      ctx.drawImage(img, 0, 0, newWidth, newHeight);

     
      const filter = filterOptions.find(f => f.id === selectedFilter);
      if (filter) {
        filter.apply(ctx, canvas);
      }
      const optimizedDataUrl = canvas.toDataURL(`image/${format}`, quality / 100);
      const optimizedSize = Math.round((optimizedDataUrl.length * 3) / 4);
      const isOptimized = optimizedSize < image.originalSize;
      setImage(prevImage => {
        if (prevImage) {
          return {
            ...prevImage,
            optimizedPreview: optimizedDataUrl,
            optimizedSize,
            isOptimized
          };
        }
        return prevImage;
      });
      setCompressionHistory(prev => [
        ...prev,
        {
          original: image.originalSize,
          optimized: optimizedSize,
          date: new Date(),
          isOptimized
        }
      ]);

      setIsOptimizing(false);

      if (isOptimized) {
        showNotification(
          'Image Optimized!',
          `Original: ${formatBytes(image.originalSize)} → Optimized: ${formatBytes(optimizedSize)} (${Math.round((1 - optimizedSize / image.originalSize) * 100)}% reduction)`
        );
      } else {
        showNotification(
          'Optimization Warning',
          `The selected parameters resulted in a larger file size. Try different settings or a different format. Original: ${formatBytes(image.originalSize)} → Result: ${formatBytes(optimizedSize)}`
        );
      }
    };

    img.src = image.preview;
  };

 
  const formatBytes = (bytes: number, decimals: number = 2) => {
    if (bytes === 0) return '0 Bytes';

    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];

    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
  };

  const downloadImage = () => {
    if (!image || !image.optimizedPreview) return;

    const link = document.createElement('a');
    link.href = image.optimizedPreview;
    link.download = `optimized-${image.file.name.split('.')[0]}.${format}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    showNotification('Download Started', 'Your optimized image is being downloaded.');
  };

 
  const handleBatchFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

   
    const imageFiles = Array.from(files).filter(file => file.type.startsWith('image/'));

    if (imageFiles.length === 0) {
      showNotification('Error', 'No valid image files were selected.');
      return;
    }

   
    const newBatchImages: BatchImageFile[] = [];

    imageFiles.forEach(file => {
      const reader = new FileReader();
      reader.onload = () => {
        const batchImage: BatchImageFile = {
          id: `${file.name}-${Date.now()}`,
          file,
          preview: reader.result as string,
          originalSize: file.size,
          status: 'pending',
          progress: 0
        };

        setBatchImages(prev => [...prev, batchImage]);
      };
      reader.readAsDataURL(file);
    });

   
    setBatchMode(true);

    showNotification(
      'Batch Processing Ready',
      `${imageFiles.length} images loaded. Configure settings and click "Process All" to begin.`
    );
  };

 
  const processBatchImage = async (batchImage: BatchImageFile): Promise<BatchImageFile> => {
    return new Promise((resolve) => {
      const img = new Image();

      img.onload = () => {
       
        const canvas = batchCanvasRef.current;
        if (!canvas) {
          resolve({
            ...batchImage,
            status: 'failed',
            progress: 100
          });
          return;
        }

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve({
            ...batchImage,
            status: 'failed',
            progress: 100
          });
          return;
        }

       
        let newWidth = img.width;
        let newHeight = img.height;

        if (newWidth > batchOptions.maxWidth) {
          newHeight = (batchOptions.maxWidth / newWidth) * newHeight;
          newWidth = batchOptions.maxWidth;
        }

        if (newHeight > batchOptions.maxHeight) {
          newWidth = (batchOptions.maxHeight / newHeight) * newWidth;
          newHeight = batchOptions.maxHeight;
        }

       
        canvas.width = newWidth;
        canvas.height = newHeight;

       
        ctx.drawImage(img, 0, 0, newWidth, newHeight);

       
        const filter = filterOptions.find(f => f.id === batchOptions.filter);
        if (filter) {
          filter.apply(ctx, canvas);
        }

       
        const optimizedDataUrl = canvas.toDataURL(`image/${batchOptions.format}`, batchOptions.quality / 100);

       
        const optimizedSize = Math.round((optimizedDataUrl.length * 3) / 4);

       
        const isOptimized = optimizedSize < batchImage.originalSize;

       
        const updatedBatchImage: BatchImageFile = {
          ...batchImage,
          optimizedPreview: optimizedDataUrl,
          optimizedSize,
          isOptimized,
          status: 'completed',
          progress: 100,
          width: img.width,
          height: img.height
        };

        resolve(updatedBatchImage);
      };

      img.onerror = () => {
        resolve({
          ...batchImage,
          status: 'failed',
          progress: 100
        });
      };

      img.src = batchImage.preview;
    });
  };

 
  const processBatchImages = async () => {
    if (batchImages.length === 0) return;

    setIsBatchProcessing(true);
    setBatchProgress(0);
    setBatchCompleted(0);

    setBatchOptions({
      quality,
      format,
      maxWidth,
      maxHeight,
      filter: selectedFilter
    });

    const updatedBatchImages = [...batchImages];
    let completed = 0;

    for (let i = 0; i < updatedBatchImages.length; i++) {
      updatedBatchImages[i] = {
        ...updatedBatchImages[i],
        status: 'processing',
        progress: 0
      };

      setBatchImages(updatedBatchImages);

      try {
        updatedBatchImages[i] = await processBatchImage(updatedBatchImages[i]);
        completed++;

        const progress = Math.round((completed / updatedBatchImages.length) * 100);
        setBatchProgress(progress);
        setBatchCompleted(completed);

        setBatchImages([...updatedBatchImages]);
      } catch (error) {
        updatedBatchImages[i] = {
          ...updatedBatchImages[i],
          status: 'failed',
          progress: 100
        };

        setBatchImages([...updatedBatchImages]);
      }
    }

    setIsBatchProcessing(false);

    const successCount = updatedBatchImages.filter(img => img.status === 'completed').length;
    const failedCount = updatedBatchImages.filter(img => img.status === 'failed').length;
    const optimizedCount = updatedBatchImages.filter(img => img.isOptimized).length;

    showNotification(
      'Batch Processing Complete',
      `Processed ${successCount} images successfully (${optimizedCount} optimized), ${failedCount} failed.`
    );
  };

  const downloadBatchImages = async () => {
    const optimizedImages = batchImages.filter(img => img.status === 'completed' && img.optimizedPreview);

    if (optimizedImages.length === 0) {
      showNotification('Error', 'No optimized images to download.');
      return;
    }

    try {
      const zip = new JSZip();

      optimizedImages.forEach(img => {
        if (!img.optimizedPreview) return;
        const base64Data = img.optimizedPreview.split(',')[1];
        const extension = format === 'jpeg' ? 'jpg' : format;
        const filename = `optimized-${img.file.name.split('.')[0]}.${extension}`;
        zip.file(filename, base64Data, { base64: true });
      });
      const zipBlob = await zip.generateAsync({ type: 'blob' });
      saveAs(zipBlob, `optimized-images-${new Date().toISOString().slice(0, 10)}.zip`);

      showNotification(
        'Download Started',
        `Downloading ${optimizedImages.length} optimized images as a zip file.`
      );
    } catch (error) {
      showNotification('Error', 'Failed to create zip file. Please try again.');
    }
  };

  const toggleBatchMode = () => {
    setBatchMode(!batchMode);
  };

  useEffect(() => {
    return () => {
      if (notificationTimerRef.current) {
        clearTimeout(notificationTimerRef.current);
      }

      if (image && image.preview) {
        URL.revokeObjectURL(image.preview);
      }
    };
  }, []);

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-theme-gradient-start via-theme-gradient-middle to-theme-gradient-end flex flex-col items-center justify-start py-12 px-4 transition-colors duration-300">
      {/* Notification */}
      <Notification
        message={notification.message}
        content={notification.content}
        isVisible={notification.isVisible}
      />

      {/* Hidden canvases for image processing */}
      <canvas ref={canvasRef} style={{ display: 'none' }} />
      <canvas ref={batchCanvasRef} style={{ display: 'none' }} />

      {/* Main Heading */}
      <div className="w-full max-w-3xl bg-gray-800/90 backdrop-blur-md rounded-lg shadow-lg p-8 border border-theme-border/30 mb-8 dark:bg-black/80 dark:border-white/20">
        <h1 className="text-5xl md:text-6xl font-extrabold font-saira text-theme-primary drop-shadow-lg mb-4 text-center">
          Image Optimizer
        </h1>
        <section className="text-center">
          <p className="text-xl max-w-3xl mx-auto text-gray-100 font-medium shadow-sm mb-4">
            Optimize your images for the web. Reduce file size without sacrificing quality, resize dimensions, and convert between formats.
          </p>
        </section>
      </div>

      {/* Image Optimizer Tool */}
      <div className="w-full max-w-6xl mb-10">
        <div className="bg-gray-800/90 backdrop-blur-md rounded-lg shadow-lg p-6 border border-theme-border/30 dark:bg-black/80 dark:border-white/20">
          {/* File Upload Section */}
          <div className="mb-8">
            <h2 className="text-2xl font-saira text-theme-primary font-semibold mb-4">Upload Image</h2>
            <div className="border-2 border-dashed border-gray-600 rounded-lg p-8 text-center">
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
                id="image-upload"
              />
              <label
                htmlFor="image-upload"
                className="cursor-pointer bg-theme-primary hover:bg-theme-primary/80 text-white font-bold py-3 px-6 rounded-md transition-all duration-200 inline-block"
              >
                Select Image
              </label>
              <p className="text-gray-400 mt-3">
                Supported formats: JPEG, PNG, WebP, GIF, etc.
              </p>
              {image && (
                <p className="text-gray-300 mt-2">
                  Selected: {image.file.name} ({formatBytes(image.originalSize)})
                </p>
              )}
            </div>
          </div>

          {image && (
            <>
              {/* Image Preview */}
              <div className="mb-8">
                <h2 className="text-2xl font-saira text-theme-primary font-semibold mb-4">Preview</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-gray-900 rounded-lg p-4 border border-gray-700">
                    <h3 className="text-lg text-white mb-2">Original</h3>
                    <div className="aspect-video bg-black/50 rounded-lg overflow-hidden flex items-center justify-center">
                      <img
                        src={image.preview}
                        alt="Original"
                        className="max-w-full max-h-full object-contain"
                      />
                    </div>
                    <p className="text-gray-300 mt-2 text-center">
                      Size: {formatBytes(image.originalSize)}
                    </p>
                  </div>

                  <div className="bg-gray-900 rounded-lg p-4 border border-gray-700">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-lg text-white">Optimized</h3>
                      {image.optimizedPreview && (
                        image.isOptimized ? (
                          <span className="bg-green-800 text-green-200 text-xs px-2 py-1 rounded flex items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                            Optimized
                          </span>
                        ) : (
                          <span className="bg-yellow-800 text-yellow-200 text-xs px-2 py-1 rounded flex items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                            </svg>
                            Size Increased
                          </span>
                        )
                      )}
                    </div>
                    <div className="aspect-video bg-black/50 rounded-lg overflow-hidden flex items-center justify-center">
                      {image.optimizedPreview ? (
                        <img
                          src={image.optimizedPreview}
                          alt="Optimized"
                          className="max-w-full max-h-full object-contain"
                        />
                      ) : (
                        <div className="text-gray-500 text-center">
                          {isOptimizing ? (
                            <div className="flex flex-col items-center">
                              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-theme-primary mb-2"></div>
                              <p>Optimizing...</p>
                            </div>
                          ) : (
                            <p>Click "Optimize" to see the result</p>
                          )}
                        </div>
                      )}
                    </div>
                    <p className="text-gray-300 mt-2 text-center">
                      {image.optimizedSize ? (
                        <>
                          Size: {formatBytes(image.optimizedSize)}
                          {image.optimizedSize < image.originalSize ? (
                            <span className="text-green-400">
                              {" "}({Math.round((1 - image.optimizedSize / image.originalSize) * 100)}% reduction)
                            </span>
                          ) : (
                            <span className="text-yellow-400">
                              {" "}(File size increased by {Math.round((image.optimizedSize / image.originalSize - 1) * 100)}%)
                            </span>
                          )}
                        </>
                      ) : (
                        'Size: N/A'
                      )}
                    </p>
                  </div>
                </div>
              </div>

              {/* Presets */}
              <div className="mb-8">
                <h2 className="text-2xl font-saira text-theme-primary font-semibold mb-4">Optimization Presets</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
                  {presetOptions.map((preset) => (
                    <button
                      key={preset.id}
                      onClick={() => applyPreset(preset.id)}
                      className={`p-3 rounded-lg border transition-all ${
                        selectedPreset === preset.id
                          ? 'bg-theme-primary/20 border-theme-primary text-white'
                          : 'bg-gray-800 border-gray-700 text-gray-300 hover:bg-gray-700'
                      }`}
                    >
                      <div className="text-sm font-medium">{preset.name}</div>
                      <div className="text-xs mt-1 text-gray-400">{preset.description}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Optimization Controls */}
              <div className="mb-8">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-2xl font-saira text-theme-primary font-semibold">Optimization Settings</h2>
                  <button
                    onClick={() => setShowAdvancedOptions(!showAdvancedOptions)}
                    className="text-sm text-theme-primary hover:underline flex items-center"
                  >
                    {showAdvancedOptions ? 'Hide Advanced Options' : 'Show Advanced Options'}
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className={`h-4 w-4 ml-1 transition-transform ${showAdvancedOptions ? 'rotate-180' : ''}`}
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-gray-900 rounded-lg p-4 border border-gray-700">
                    <div className="mb-4">
                      <label className="block text-gray-300 mb-2">Quality ({quality}%)</label>
                      <input
                        type="range"
                        min="10"
                        max="100"
                        value={quality}
                        onChange={(e) => setQuality(parseInt(e.target.value))}
                        className="w-full"
                      />
                      <div className="flex justify-between text-xs text-gray-400 mt-1">
                        <span>Smaller file</span>
                        <span>Better quality</span>
                      </div>
                    </div>

                    <div className="mb-4">
                      <label className="block text-gray-300 mb-2">Output Format</label>
                      <select
                        value={format}
                        onChange={(e) => setFormat(e.target.value as 'jpeg' | 'png' | 'webp')}
                        className="w-full bg-gray-700 text-white rounded-md py-2 px-3 border border-gray-600"
                      >
                        <option value="jpeg">JPEG (best for photos)</option>
                        <option value="png">PNG (best for graphics with transparency)</option>
                        <option value="webp">WebP (modern format, smaller size)</option>
                      </select>
                    </div>

                    {showAdvancedOptions && (
                      <div className="mb-4">
                        <label className="block text-gray-300 mb-2">Image Filter</label>
                        <select
                          value={selectedFilter}
                          onChange={(e) => setSelectedFilter(e.target.value)}
                          className="w-full bg-gray-700 text-white rounded-md py-2 px-3 border border-gray-600"
                        >
                          {filterOptions.map((filter) => (
                            <option key={filter.id} value={filter.id}>
                              {filter.name} - {filter.description}
                            </option>
                          ))}
                        </select>
                      </div>
                    )}
                  </div>

                  <div className="bg-gray-900 rounded-lg p-4 border border-gray-700">
                    <div className="flex items-center justify-between mb-4">
                      <label className="block text-gray-300">Resize Image</label>
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          id="maintain-aspect-ratio"
                          checked={maintainAspectRatio}
                          onChange={(e) => setMaintainAspectRatio(e.target.checked)}
                          className="mr-2"
                        />
                        <label htmlFor="maintain-aspect-ratio" className="text-gray-300 text-sm">
                          Maintain aspect ratio
                        </label>
                      </div>
                    </div>

                    <div className="mb-4">
                      <label className="block text-gray-300 mb-2">Max Width (pixels)</label>
                      <input
                        type="number"
                        min="100"
                        max="8000"
                        value={maxWidth}
                        onChange={(e) => handleDimensionChange('width', parseInt(e.target.value))}
                        className="w-full bg-gray-700 text-white rounded-md py-2 px-3 border border-gray-600"
                      />
                    </div>

                    <div className="mb-4">
                      <label className="block text-gray-300 mb-2">Max Height (pixels)</label>
                      <input
                        type="number"
                        min="100"
                        max="8000"
                        value={maxHeight}
                        onChange={(e) => handleDimensionChange('height', parseInt(e.target.value))}
                        className="w-full bg-gray-700 text-white rounded-md py-2 px-3 border border-gray-600"
                      />
                    </div>

                    {image && image.width && image.height && (
                      <p className="text-gray-400 text-sm">
                        Original dimensions: {image.width} × {image.height} pixels
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Compression History */}
              {compressionHistory.length > 0 && (
                <div className="mb-8">
                  <h2 className="text-2xl font-saira text-theme-primary font-semibold mb-4">Compression History</h2>
                  <div className="bg-gray-900 rounded-lg p-4 border border-gray-700">
                    <div className="overflow-x-auto">
                      <table className="w-full text-gray-300">
                        <thead>
                          <tr className="border-b border-gray-700">
                            <th className="py-2 px-4 text-left">Time</th>
                            <th className="py-2 px-4 text-left">Original Size</th>
                            <th className="py-2 px-4 text-left">Result Size</th>
                            <th className="py-2 px-4 text-left">Change</th>
                            <th className="py-2 px-4 text-left">Status</th>
                          </tr>
                        </thead>
                        <tbody>
                          {compressionHistory.map((item, index) => (
                            <tr key={index} className="border-b border-gray-800">
                              <td className="py-2 px-4">{item.date.toLocaleTimeString()}</td>
                              <td className="py-2 px-4">{formatBytes(item.original)}</td>
                              <td className="py-2 px-4">{formatBytes(item.optimized)}</td>
                              <td className="py-2 px-4">
                                {item.isOptimized ? (
                                  <span className="text-green-400">
                                    -{Math.round((1 - item.optimized / item.original) * 100)}%
                                  </span>
                                ) : (
                                  <span className="text-yellow-400">
                                    +{Math.round((item.optimized / item.original - 1) * 100)}%
                                  </span>
                                )}
                              </td>
                              <td className="py-2 px-4">
                                {item.isOptimized ? (
                                  <span className="bg-green-800 text-green-200 text-xs px-2 py-1 rounded">
                                    Optimized
                                  </span>
                                ) : (
                                  <span className="bg-yellow-800 text-yellow-200 text-xs px-2 py-1 rounded">
                                    Size Increased
                                  </span>
                                )}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row justify-center gap-4 mb-6">
                <button
                  onClick={optimizeImage}
                  disabled={isOptimizing}
                  className="bg-theme-primary hover:bg-theme-primary/80 text-white font-bold py-3 px-6 rounded-md transition-all duration-200 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isOptimizing ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white mr-2"></div>
                      Optimizing...
                    </>
                  ) : (
                    <>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                      Optimize Image
                    </>
                  )}
                </button>

                {image.optimizedPreview && (
                  <button
                    onClick={downloadImage}
                    className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-md transition-all duration-200 flex items-center justify-center"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                    </svg>
                    Download Optimized Image
                  </button>
                )}

                <button
                  onClick={() => {
                    setImage(null);
                    setQuality(80);
                    setMaxWidth(1920);
                    setMaxHeight(1080);
                    setFormat('jpeg');
                    setSelectedFilter('none');
                    setSelectedPreset('custom');
                  }}
                  className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-3 px-6 rounded-md transition-all duration-200 flex items-center justify-center"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  Reset
                </button>
              </div>

              {/* Tips Section */}
              <div className="bg-gray-900/70 rounded-lg p-4 border border-gray-700 mb-6">
                <h3 className="text-lg font-medium text-theme-primary mb-2">Optimization Tips</h3>
                <ul className="list-disc list-inside text-gray-300 text-sm space-y-1">
                  <li>Use <strong>WebP</strong> format for the best compression ratio on modern browsers</li>
                  <li>For photos, JPEG with 70-80% quality is usually a good balance</li>
                  <li>For graphics with transparency, use PNG format</li>
                  <li>Resize large images to the maximum dimensions needed for your website</li>
                  <li>Apply filters like "Sharpen" after compression to enhance details</li>
                  <li>Use the "Email/Messaging" preset for images you plan to share via messaging apps</li>
                </ul>

                <div className="mt-3 bg-yellow-900/30 p-3 rounded border border-yellow-700/50">
                  <h4 className="text-yellow-400 font-medium flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Why might file size increase?
                  </h4>
                  <p className="text-gray-300 text-sm mt-1">
                    In some cases, the optimized file might be larger than the original. This can happen when:
                  </p>
                  <ul className="list-disc list-inside text-gray-300 text-xs mt-1 space-y-1 ml-2">
                    <li>The original image is already highly optimized</li>
                    <li>Converting from a lossy format (JPEG) to a lossless one (PNG)</li>
                    <li>Using very high quality settings (90%+)</li>
                    <li>Applying certain filters that add complexity to the image</li>
                  </ul>
                  <p className="text-gray-300 text-xs mt-2">
                    If this happens, try using a different format, lower quality setting, or different preset.
                  </p>
                </div>
              </div>

              {/* Batch Processing */}
              <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-medium text-theme-primary">Batch Image Processing</h3>
                  <div className="flex items-center">
                    <div className="inline-block bg-blue-500 text-white text-xs font-bold px-2 py-1 rounded mr-2">
                      BETA
                    </div>
                    <button
                      onClick={toggleBatchMode}
                      className="text-sm text-theme-primary hover:underline"
                    >
                      {batchMode ? 'Switch to Single Mode' : 'Switch to Batch Mode'}
                    </button>
                  </div>
                </div>

                {!batchMode ? (
                  <>
                    <p className="text-gray-300 text-sm mb-4">
                      Optimize multiple images at once with our batch processing feature.
                      Select multiple images and download the optimized versions as a zip file.
                    </p>
                    <div className="flex justify-center">
                      <label
                        htmlFor="batch-image-upload"
                        className="cursor-pointer bg-theme-primary hover:bg-theme-primary/80 text-white font-bold py-2 px-4 rounded-md transition-all duration-200 inline-flex items-center"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        Select Multiple Images
                      </label>
                      <input
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={handleBatchFileChange}
                        className="hidden"
                        id="batch-image-upload"
                      />
                    </div>
                  </>
                ) : (
                  <>
                    {/* Batch processing interface */}
                    <div className="mb-4">
                      <div className="flex justify-between items-center mb-2">
                        <h4 className="text-white font-medium">Images ({batchImages.length})</h4>
                        <div className="flex space-x-2">
                          <button
                            onClick={() => {
                              const input = document.getElementById('batch-image-upload') as HTMLInputElement;
                              if (input) input.click();
                            }}
                            className="text-xs bg-gray-700 hover:bg-gray-600 text-white py-1 px-2 rounded inline-flex items-center"
                            disabled={isBatchProcessing}
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                            </svg>
                            Add More
                          </button>
                          <button
                            onClick={() => setBatchImages([])}
                            className="text-xs bg-red-700 hover:bg-red-600 text-white py-1 px-2 rounded inline-flex items-center"
                            disabled={isBatchProcessing || batchImages.length === 0}
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                            Clear All
                          </button>
                        </div>
                      </div>

                      {batchImages.length > 0 ? (
                        <div className="bg-gray-900 rounded-lg border border-gray-700 p-2 max-h-60 overflow-y-auto">
                          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                            {batchImages.map((img) => (
                              <div
                                key={img.id}
                                className={`relative rounded overflow-hidden border ${
                                  img.status === 'completed'
                                    ? img.isOptimized
                                      ? 'border-green-500'
                                      : 'border-yellow-500'
                                    : img.status === 'failed'
                                    ? 'border-red-500'
                                    : 'border-gray-600'
                                }`}
                              >
                                <img
                                  src={img.optimizedPreview || img.preview}
                                  alt={img.file.name}
                                  className="w-full h-20 object-cover"
                                />
                                <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                                  {img.status === 'processing' ? (
                                    <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-theme-primary"></div>
                                  ) : img.status === 'completed' ? (
                                    <div className={`text-xs font-bold px-2 py-1 rounded ${
                                      img.isOptimized ? 'bg-green-800 text-green-200' : 'bg-yellow-800 text-yellow-200'
                                    }`}>
                                      {img.isOptimized
                                        ? `-${Math.round((1 - (img.optimizedSize || 0) / img.originalSize) * 100)}%`
                                        : `+${Math.round(((img.optimizedSize || 0) / img.originalSize - 1) * 100)}%`}
                                    </div>
                                  ) : img.status === 'failed' ? (
                                    <span className="text-xs bg-red-800 text-red-200 px-2 py-1 rounded">Failed</span>
                                  ) : (
                                    <span className="text-xs bg-gray-800 text-gray-200 px-2 py-1 rounded">Pending</span>
                                  )}
                                </div>
                                <div className="absolute top-0 right-0 p-1">
                                  <button
                                    onClick={() => {
                                      setBatchImages(batchImages.filter(i => i.id !== img.id));
                                    }}
                                    className="text-white bg-black/50 rounded-full p-1 hover:bg-black/70"
                                    disabled={isBatchProcessing}
                                  >
                                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                  </button>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      ) : (
                        <div className="bg-gray-900 rounded-lg border border-gray-700 p-4 text-center">
                          <p className="text-gray-400">No images selected. Click "Select Multiple Images" to begin.</p>
                        </div>
                      )}
                    </div>

                    {/* Batch progress */}
                    {isBatchProcessing && (
                      <div className="mb-4">
                        <div className="flex justify-between text-sm text-gray-300 mb-1">
                          <span>Processing images...</span>
                          <span>{batchCompleted} of {batchImages.length} complete</span>
                        </div>
                        <div className="w-full bg-gray-700 rounded-full h-2.5">
                          <div
                            className="bg-theme-primary h-2.5 rounded-full"
                            style={{ width: `${batchProgress}%` }}
                          ></div>
                        </div>
                      </div>
                    )}

                    {/* Batch actions */}
                    <div className="flex flex-wrap gap-2 justify-center">
                      <button
                        onClick={processBatchImages}
                        disabled={isBatchProcessing || batchImages.length === 0}
                        className="bg-theme-primary hover:bg-theme-primary/80 text-white font-bold py-2 px-4 rounded-md transition-all duration-200 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isBatchProcessing ? (
                          <>
                            <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white mr-2"></div>
                            Processing...
                          </>
                        ) : (
                          <>
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                            </svg>
                            Process All Images
                          </>
                        )}
                      </button>

                      <button
                        onClick={downloadBatchImages}
                        disabled={batchImages.filter(img => img.status === 'completed').length === 0 || isBatchProcessing}
                        className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-md transition-all duration-200 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                        </svg>
                        Download All as ZIP
                      </button>
                    </div>
                  </>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ImageOptimizer;
