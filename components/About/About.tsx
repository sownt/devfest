import React from 'react';

interface AboutBlock {
    id: number;
    title: string;
    description: string;
}

interface AboutProps {
    title: string;
    description: string;
    blocks: AboutBlock[];
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const About: React.FC<AboutProps> = ({ title, description, blocks }) => {
    return (
        <section className="max-w-6xl mx-auto px-4 py-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Column 1: Title and Description */}
                <p className="text-gray-700 text-justify">{description}</p>

                {/* Column 2: Keynotes Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {blocks.map((block) => (
                        <div key={block.id} className="flex flex-col items-center justify-center gap-2">
                            <h3 className="text-4xl font-semibold">{block.title}</h3>
                            <p className="text-gray-600">{block.description}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default About;
