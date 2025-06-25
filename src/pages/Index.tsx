
import { SVGGenerator } from '@/components/SVGGenerator';

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50">
      <div className="container mx-auto py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            Generate SVG for use in backgrounds, as tiles, etc
          </h1>
        </div>
        
        <SVGGenerator />
      </div>
    </div>
  );
};

export default Index;
