import React, { useState } from 'react';
import { Brain, ChevronRight, XCircle, CheckCircle2, ListChecks, Calculator } from 'lucide-react';

type Option = {
  name: string;
  scores: Record<string, number>;
  totalScore?: number;
};

type Domain = {
  name: string;
  importance: number;
};

function App() {
  const [step, setStep] = useState(0);
  const [isOwnDecision, setIsOwnDecision] = useState<boolean | null>(null);
  const [domains, setDomains] = useState<Domain[]>([]);
  const [newDomain, setNewDomain] = useState('');
  const [options, setOptions] = useState<Option[]>([]);
  const [newOption, setNewOption] = useState('');
  const [hasDeadbreakers, setHasDeadbreakers] = useState<boolean | null>(null);
  const [jobsHaveDeadbreakers, setJobsHaveDeadbreakers] = useState<boolean | null>(null);
  const [feeling, setFeeling] = useState<'great' | 'not-great' | null>(null);

  const handleAddDomain = () => {
    if (newDomain.trim() && domains.length < 3) {
      setDomains([...domains, { name: newDomain.trim(), importance: 5 }]);
      setNewDomain('');
    }
  };

  const handleAddOption = () => {
    if (newOption.trim()) {
      setOptions([
        ...options,
        {
          name: newOption.trim(),
          scores: domains.reduce((acc, domain) => ({ ...acc, [domain.name]: 5 }), {}),
        },
      ]);
      setNewOption('');
    }
  };

  const calculateScores = () => {
    return options.map(option => ({
      ...option,
      totalScore: Object.entries(option.scores).reduce(
        (total, [domain, score]) => 
          total + score * (domains.find(d => d.name === domain)?.importance || 1),
        0
      ),
    }));
  };

  const renderStep = () => {
    switch (step) {
      case 0:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold">Ownership Check</h2>
            <p className="text-gray-600">Is the choice yours to make?</p>
            <div className="flex space-x-4">
              <button
                onClick={() => { setIsOwnDecision(true); setStep(1); }}
                className="flex items-center px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700"
              >
                <CheckCircle2 className="w-5 h-5 mr-2" />
                Yes
              </button>
              <button
                onClick={() => { setIsOwnDecision(false); setStep(8); }}
                className="flex items-center px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700"
              >
                <XCircle className="w-5 h-5 mr-2" />
                No
              </button>
            </div>
          </div>
        );

      case 1:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold">Important Domains</h2>
            <p className="text-gray-600">What are the 3 most important things to you?</p>
            <div className="space-y-4">
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={newDomain}
                  onChange={(e) => setNewDomain(e.target.value)}
                  className="flex-1 p-2 border rounded-lg"
                  placeholder="Enter a domain"
                />
                <button
                  onClick={handleAddDomain}
                  disabled={domains.length >= 3}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:bg-gray-400"
                >
                  Add
                </button>
              </div>
              {domains.map((domain, index) => (
                <div key={index} className="flex items-center space-x-4">
                  <span className="flex-1">{domain.name}</span>
                  <input
                    type="range"
                    min="1"
                    max="10"
                    value={domain.importance}
                    onChange={(e) => {
                      const newDomains = [...domains];
                      newDomains[index].importance = parseInt(e.target.value);
                      setDomains(newDomains);
                    }}
                    className="w-48"
                  />
                  <span className="w-8 text-center">{domain.importance}</span>
                </div>
              ))}
            </div>
            {domains.length === 3 && (
              <button
                onClick={() => setStep(2)}
                className="flex items-center px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
              >
                Next
                <ChevronRight className="w-5 h-5 ml-2" />
              </button>
            )}
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold">List Your Options</h2>
            <div className="space-y-4">
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={newOption}
                  onChange={(e) => setNewOption(e.target.value)}
                  className="flex-1 p-2 border rounded-lg"
                  placeholder="Enter an option"
                />
                <button
                  onClick={handleAddOption}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                >
                  Add
                </button>
              </div>
              {options.map((option, index) => (
                <div key={index} className="p-4 bg-gray-50 rounded-lg">
                  {option.name}
                </div>
              ))}
            </div>
            {options.length > 0 && (
              <button
                onClick={() => setStep(3)}
                className="flex items-center px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
              >
                Next
                <ChevronRight className="w-5 h-5 ml-2" />
              </button>
            )}
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold">Deadbreakers</h2>
            <p className="text-gray-600">Do YOU have any dealbreakers?</p>
            <div className="flex space-x-4">
              <button
                onClick={() => { setHasDeadbreakers(true); setStep(4); }}
                className="flex items-center px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
              >
                Yes
              </button>
              <button
                onClick={() => { setHasDeadbreakers(false); setStep(5); }}
                className="flex items-center px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
              >
                No
              </button>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold">Check Options</h2>
            <p className="text-gray-600">Do any jobs have those dealbreakers?</p>
            <div className="flex space-x-4">
              <button
                onClick={() => { setJobsHaveDeadbreakers(true); setStep(5); }}
                className="flex items-center px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
              >
                Yes
              </button>
              <button
                onClick={() => { setJobsHaveDeadbreakers(false); setStep(5); }}
                className="flex items-center px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
              >
                No
              </button>
            </div>
          </div>
        );

      case 5:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold">Score Options</h2>
            <p className="text-gray-600">Rate each option for each domain (1-10)</p>
            <div className="space-y-6">
              {options.map((option, optionIndex) => (
                <div key={optionIndex} className="p-4 bg-gray-50 rounded-lg space-y-4">
                  <h3 className="font-bold">{option.name}</h3>
                  {domains.map((domain, domainIndex) => (
                    <div key={domainIndex} className="flex items-center space-x-4">
                      <span className="w-32">{domain.name}</span>
                      <input
                        type="range"
                        min="1"
                        max="10"
                        value={option.scores[domain.name]}
                        onChange={(e) => {
                          const newOptions = [...options];
                          newOptions[optionIndex].scores[domain.name] = parseInt(e.target.value);
                          setOptions(newOptions);
                        }}
                        className="flex-1"
                      />
                      <span className="w-8 text-center">{option.scores[domain.name]}</span>
                    </div>
                  ))}
                </div>
              ))}
            </div>
            <button
              onClick={() => setStep(6)}
              className="flex items-center px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
            >
              Calculate Results
              <Calculator className="w-5 h-5 ml-2" />
            </button>
          </div>
        );

      case 6:
        const scoredOptions = calculateScores();
        const bestOption = scoredOptions.reduce((prev, current) => 
          (current.totalScore || 0) > (prev.totalScore || 0) ? current : prev
        );
        
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold">Results</h2>
            <div className="space-y-4">
              {scoredOptions.map((option, index) => (
                <div 
                  key={index}
                  className={`p-4 rounded-lg ${option.name === bestOption.name ? 'bg-green-50 border-2 border-green-500' : 'bg-gray-50'}`}
                >
                  <div className="flex justify-between items-center">
                    <span className="font-bold">{option.name}</span>
                    <span className="text-xl font-bold">{option.totalScore}</span>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-8">
              <h3 className="text-xl font-bold mb-4">How do you feel about {bestOption.name}?</h3>
              <div className="flex space-x-4">
                <button
                  onClick={() => { setFeeling('great'); setStep(7); }}
                  className="flex items-center px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700"
                >
                  Great!
                </button>
                <button
                  onClick={() => { setFeeling('not-great'); setStep(1); }}
                  className="flex items-center px-6 py-3 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700"
                >
                  Not great...
                </button>
              </div>
            </div>
          </div>
        );

      case 7:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-green-600">Decision Complete!</h2>
            <p className="text-gray-600">You've made your decision following a structured process.</p>
            <button
              onClick={() => window.location.reload()}
              className="flex items-center px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
            >
              Start New Decision
            </button>
          </div>
        );

      case 8:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-red-600">Don't Make the Decision</h2>
            <p className="text-gray-600">This decision is not yours to make.</p>
            <button
              onClick={() => window.location.reload()}
              className="flex items-center px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
            >
              Start New Decision
            </button>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-center mb-8">
          <Brain className="w-12 h-12 text-indigo-600" />
          <h1 className="text-3xl font-bold text-gray-900 ml-4">
            The Anatomy of a Good Decision
          </h1>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-8">
          {renderStep()}
        </div>
      </div>
    </div>
  );
}

export default App;