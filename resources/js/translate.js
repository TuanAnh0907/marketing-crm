import { usePage } from '@inertiajs/react';

export function useI18n() {
    const { translations } = usePage().props;

    const __ = (key, replacements = {}) => {
        let translation = translations[key] || key;

        Object.keys(replacements).forEach(r => {
            translation = translation.replace(`:${r}`, replacements[r]);
        });

        return translation;
    };

    return { __ };
}

/**
 * A simple helper that can be used outside of components if needed,
 * but useI18n is preferred for reactivity.
 */
export function __(key, replacements = {}) {
    const { translations } = usePage().props;
    let translation = translations[key] || key;

    Object.keys(replacements).forEach(r => {
        translation = translation.replace(`:${r}`, replacements[r]);
    });

    return translation;
}
