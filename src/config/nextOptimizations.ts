// Configuration: Next.js - Optimisations avancées

/**
 * Optimisations Next.js à ajouter dans next.config.ts
 *
 * IMPORTANT: Ce fichier contient des configurations à copier
 * dans votre next.config.ts existant
 */

const nextOptimizations = {
  // 1. Compiler options
  compiler: {
    removeConsole:
      process.env.NODE_ENV === "production"
        ? {
            exclude: ["error", "warn"],
          }
        : false,
    reactRemoveProperties: process.env.NODE_ENV === "production",
  },

  // 2. Experimental features
  experimental: {
    optimizeCss: true, // Optimiser CSS
    optimizePackageImports: ["@apollo/client", "lodash", "date-fns", "gsap"], // Tree-shake ces packages
    serverMinification: true, // Minifier le code serveur
    turbo: {
      // Turbopack pour dev (plus rapide que webpack)
      resolveAlias: {
        "@": "./src",
      },
    },
  },

  // 3. Production optimizations
  poweredByHeader: false, // Retirer header X-Powered-By
  compress: true, // Compression gzip

  // 4. Image optimization
  images: {
    formats: ["image/avif", "image/webp"],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 60 * 60 * 24 * 7, // 7 jours
    dangerouslyAllowSVG: true,
    contentDispositionType: "attachment",
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },

  // 5. Webpack optimizations
  webpack: (
    config: { optimization: Record<string, unknown> },
    { dev }: { dev: boolean; isServer: boolean }
  ) => {
    // Production optimizations
    if (!dev) {
      // Code splitting avancé
      config.optimization = {
        ...config.optimization,
        splitChunks: {
          chunks: "all",
          cacheGroups: {
            default: false,
            vendors: false,
            // Vendor chunk pour les gros packages
            vendor: {
              name: "vendor",
              chunks: "all",
              test: /node_modules/,
              priority: 20,
            },
            // Apollo Client séparé
            apollo: {
              name: "apollo",
              test: /[\\/]node_modules[\\/]@apollo[\\/]/,
              priority: 30,
            },
            // GSAP séparé
            gsap: {
              name: "gsap",
              test: /[\\/]node_modules[\\/]gsap[\\/]/,
              priority: 30,
            },
            // Common chunk pour code partagé
            common: {
              name: "common",
              minChunks: 2,
              priority: 10,
              reuseExistingChunk: true,
            },
          },
        },
      };

      // Minimize bundle size
      config.optimization.minimize = true;

      // Module concatenation (scope hoisting)
      config.optimization.concatenateModules = true;
    }

    return config;
  },

  // 6. Headers pour caching
  async headers() {
    return [
      {
        source: "/:all*(svg|jpg|jpeg|png|gif|webp|avif)",
        locale: false,
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
      {
        source: "/fonts/:all*(woff|woff2|ttf|otf)",
        locale: false,
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
      {
        source: "/_next/static/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
    ];
  },
};

export default nextOptimizations;
