export const telHref = (number) => `tel:${number.replace(/[^\d+]/g, "")}`;
export const mailHref = (email) => `mailto:${email}`;
