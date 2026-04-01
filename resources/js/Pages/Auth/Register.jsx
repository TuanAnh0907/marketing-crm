import {Head, Link, useForm} from '@inertiajs/react';
import GuestLayout from '@/Layouts/GuestLayout';

export default function Register() {
    const {data, setData, post, processing, errors, reset} = useForm({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('register'), {
            onFinish: () => reset('password', 'password_confirmation'),
        });
    };

    return (
        <GuestLayout title="Create your account">
            <Head title="Register"/>

            <form onSubmit={submit} className="space-y-5">
                {/* Name */}
                <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1.5">
                        Full Name
                    </label>
                    <input
                        type="text"
                        value={data.name}
                        onChange={(e) => setData('name', e.target.value)}
                        autoComplete="name"
                        placeholder="John Doe"
                        className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 text-white text-sm placeholder-gray-500
                                   focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
                    />
                    {errors.name && (
                        <p className="mt-1.5 text-xs text-red-400">{errors.name}</p>
                    )}
                </div>

                {/* Email */}
                <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1.5">
                        Email
                    </label>
                    <input
                        type="email"
                        value={data.email}
                        onChange={(e) => setData('email', e.target.value)}
                        autoComplete="username"
                        placeholder="you@example.com"
                        className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 text-white text-sm placeholder-gray-500
                                   focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
                    />
                    {errors.email && (
                        <p className="mt-1.5 text-xs text-red-400">{errors.email}</p>
                    )}
                </div>

                {/* Password */}
                <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1.5">
                        Password
                    </label>
                    <input
                        type="password"
                        value={data.password}
                        onChange={(e) => setData('password', e.target.value)}
                        autoComplete="new-password"
                        placeholder="••••••••"
                        className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 text-white text-sm placeholder-gray-500
                                   focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
                    />
                    {errors.password && (
                        <p className="mt-1.5 text-xs text-red-400">{errors.password}</p>
                    )}
                </div>

                {/* Confirm Password */}
                <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1.5">
                        Confirm Password
                    </label>
                    <input
                        type="password"
                        value={data.password_confirmation}
                        onChange={(e) => setData('password_confirmation', e.target.value)}
                        autoComplete="new-password"
                        placeholder="••••••••"
                        className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 text-white text-sm placeholder-gray-500
                                   focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
                    />
                    {errors.password_confirmation && (
                        <p className="mt-1.5 text-xs text-red-400">{errors.password_confirmation}</p>
                    )}
                </div>

                {/* Submit */}
                <button
                    type="submit"
                    disabled={processing}
                    className="w-full bg-indigo-600 hover:bg-indigo-500 disabled:opacity-60 disabled:cursor-not-allowed
                               text-white font-medium rounded-lg px-4 py-2.5 text-sm transition"
                >
                    {processing ? 'Creating account...' : 'Create account'}
                </button>
            </form>

            <p className="mt-6 text-center text-sm text-gray-500">
                Already have an account?{' '}
                <Link href={route('login')} className="text-indigo-400 hover:text-indigo-300 font-medium transition">
                    Sign in
                </Link>
            </p>
        </GuestLayout>
    );
}
