import React from 'react';
import { Menu, Transition } from '@headlessui/react';
import { Link, usePage } from '@inertiajs/react';
import { ChevronDown } from 'lucide-react';
import { FlagEN, FlagVI } from './FlagIcons';
import { useI18n } from '../translate';

const languages = [
    {
        id: 'en',
        name: 'English',
        flag: FlagEN
    },
    {
        id: 'vi',
        name: 'Tiếng Việt',
        flag: FlagVI
    }
];

export default function LanguageSwitcher() {
    const { locale } = usePage().props;
    const { __ } = useI18n();
    const currentLang = languages.find(lang => lang.id === locale) || languages[0];

    return (
        <Menu as="div" className="relative inline-block text-left">
            <div>
                <Menu.Button className="inline-flex w-full justify-center items-center gap-2 rounded-lg bg-white px-3 py-2 text-sm font-semibold text-gray-700 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 transition-all duration-200">
                    <currentLang.flag className="w-4 h-4 rounded-sm shadow-sm" />
                    <span className="hidden sm:inline">{currentLang.name}</span>
                    <ChevronDown className="-mr-1 h-4 w-4 text-gray-400" aria-hidden="true" />
                </Menu.Button>
            </div>

            <Transition
                as={React.Fragment}
                enter="transition ease-out duration-100"
                enterFrom="transform opacity-0 scale-95"
                enterTo="transform opacity-100 scale-100"
                leave="transition ease-in duration-75"
                leaveFrom="transform opacity-100 scale-100"
                leaveTo="transform opacity-0 scale-95"
            >
                <Menu.Items className="absolute right-0 z-50 mt-2 w-48 origin-top-right rounded-xl bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none overflow-hidden">
                    <div className="py-1">
                        {languages.map((lang) => (
                            <Menu.Item key={lang.id}>
                                {({ active }) => (
                                    <Link
                                        href={route('locale.switch', lang.id)}
                                        className={`
                                            flex items-center gap-3 px-4 py-2.5 text-sm transition-colors
                                            ${active ? 'bg-indigo-50 text-indigo-700' : 'text-gray-700'}
                                            ${locale === lang.id ? 'font-bold text-indigo-600' : ''}
                                        `}
                                    >
                                        <lang.flag className="w-5 h-4 rounded-sm shadow-sm" />
                                        {lang.name}
                                        {locale === lang.id && (
                                            <div className="ml-auto w-1.5 h-1.5 rounded-full bg-indigo-600" />
                                        )}
                                    </Link>
                                )}
                            </Menu.Item>
                        ))}
                    </div>
                </Menu.Items>
            </Transition>
        </Menu>
    );
}
