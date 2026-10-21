// Prefix a site-root path ("/trial/") with the deployment base ("/automation-tools-site").
export const url = (path: string) => `${import.meta.env.BASE_URL.replace(/\/$/, '')}${path}`;
