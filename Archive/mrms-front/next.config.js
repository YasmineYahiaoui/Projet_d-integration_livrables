/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    webpack: (config) => {
        // This ensures CSS is properly processed
        const rules = config.module.rules
            .find((rule) => typeof rule.oneOf === 'object')
            .oneOf.filter((rule) => Array.isArray(rule.use) && rule.use.some((use) => use.loader?.includes('css-loader')));

        rules.forEach((rule) => {
            rule.use.forEach((use) => {
                if (use.loader?.includes('css-loader') && use.options.modules) {
                    use.options.modules.exportOnlyLocals = false;
                }
            });
        });

        return config;
    },
};

module.exports = nextConfig;