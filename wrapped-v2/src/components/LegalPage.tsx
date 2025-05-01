interface LegalPageProps {
  title: string;
  lastUpdated?: string;
  children: React.ReactNode;
}

const LegalPage: React.FC<LegalPageProps> = ({ title, lastUpdated, children }) => {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-8">
        <h1 className="text-3xl font-saira mb-2">{title}</h1>
        {lastUpdated && (
          <p className="text-gray-500 mb-8">Last updated: {lastUpdated}</p>
        )}
        <div className="prose max-w-none">{children}</div>
      </div>
    </div>
  );
};

export default LegalPage; 