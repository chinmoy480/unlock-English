import React from 'react';
import { APP_CONSTANTS } from '../types';

const Footer: React.FC = () => {
    return (
        <footer className="bg-brand-navy text-white pt-16 pb-8 mt-20 relative overflow-hidden">
            {/* Background pattern */}
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-brand-orange via-brand-green to-brand-orange"></div>
            <div className="absolute -top-24 -right-24 w-48 h-48 bg-brand-orange rounded-full blur-[80px] opacity-10"></div>

            <div className="max-w-7xl mx-auto px-4 text-center relative z-10">
                <div className="mb-10">
                    <h2 className="text-3xl font-serif mb-3 font-bold text-white tracking-wide">{APP_CONSTANTS.APP_NAME}</h2>
                    <p className="text-brand-green italic font-medium">{APP_CONSTANTS.TAGLINE}</p>
                </div>

                <div className="h-px w-full bg-gradient-to-r from-transparent via-white/10 to-transparent mb-10 max-w-2xl mx-auto"></div>

                <div className="text-sm text-slate-300 space-y-4">
                    <div className="flex flex-col gap-1">
                        <p className="font-semibold text-white text-lg">
                            All rights reserved by Chinmoy Kumar Roy
                        </p>
                        <p className="text-slate-400">
                            Assistant Teacher (English), Narayanganj Govt. Girls' High School
                        </p>
                    </div>

                    <div className="pt-6 flex flex-col sm:flex-row justify-center items-center gap-4 text-xs font-medium tracking-wide">

                        <a href={`mailto:${APP_CONSTANTS.EMAIL}`} className="bg-white/5 hover:bg-white/10 px-4 py-2 rounded-full border border-white/5 hover:border-brand-orange/50 transition-all text-brand-greenLight">
                            Email: <span className="text-white">{APP_CONSTANTS.EMAIL}</span>
                        </a>
                    </div>
                </div>

                <p className="mt-12 text-[10px] text-slate-600 uppercase tracking-widest">
                    &copy; {new Date().getFullYear()} {APP_CONSTANTS.APP_NAME}.
                </p>
            </div>
        </footer>
    );
};

export default Footer;