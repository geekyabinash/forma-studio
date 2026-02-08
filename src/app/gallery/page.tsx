import SectionHeading from '@/components/ui/SectionHeading';
import Image from 'next/image';

export default function GalleryPage() {
    return (
        <div className="bg-dark min-h-screen pt-32 pb-20 px-6">
            <div className="max-w-7xl mx-auto text-center relative z-10">
                <SectionHeading title="Gallery" dark />

                <div className="mt-16 max-w-2xl mx-auto">
                    <p className="font-display text-3xl md:text-4xl text-cream mb-6">
                        Curating Visual Rhythms
                    </p>
                    <p className="font-sans font-light text-cream/70 text-lg leading-relaxed">
                        We are currently selecting the finest moments from our portfolio to share with you.
                        A collection of light, shadow, and architectural detail is coming soon.
                    </p>

                    <div className="mt-12 h-64 md:h-96 relative rounded-sm overflow-hidden bg-white/5 border border-white/10 flex items-center justify-center">
                        <p className="font-sans text-cream/40 uppercase tracking-widest text-sm">
                            Work in Progress
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
