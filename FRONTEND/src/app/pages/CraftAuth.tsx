import { useState } from "react";
import { ShieldCheck, Upload, CheckCircle, XCircle } from "lucide-react";

export function CraftAuth() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [verifying, setVerifying] = useState(false);
  const [result, setResult] = useState<any>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result as string);
        setResult(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleVerify = () => {
    setVerifying(true);
    // Simulate verification
    setTimeout(() => {
      setResult({
        score: 92,
        status: "genuine",
        confidence: 95,
        details: {
          materialAuthenticity: 94,
          craftingTechnique: 91,
          ageVerification: 88,
          originConsistency: 96,
        },
      });
      setVerifying(false);
    }, 2500);
  };

  return (
    <div className="py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center size-16 bg-gradient-to-br from-purple-700 to-pink-600 rounded-2xl mb-4 shadow-lg shadow-purple-500/30">
            <ShieldCheck className="size-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">CraftAuth AI</h1>
          <p className="text-xl text-gray-600">Verify the authenticity of traditional crafts</p>
        </div>

        {/* Upload Area */}
        <div className="bg-white rounded-3xl shadow-xl p-8 mb-8 border border-purple-100/50">
          <label
            htmlFor="auth-upload"
            className="flex flex-col items-center justify-center border-2 border-dashed border-purple-200 rounded-2xl p-12 cursor-pointer hover:border-purple-500 hover:bg-purple-50/50 transition-all"
          >
            <Upload className="size-12 text-gray-400 mb-4" />
            <p className="text-lg text-gray-600 mb-2">Upload craft image for verification</p>
            <p className="text-sm text-gray-400">PNG, JPG up to 10MB</p>
            <input
              id="auth-upload"
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
            />
          </label>

          {selectedImage && (
            <div className="mt-6">
              <img
                src={selectedImage}
                alt="Craft to verify"
                className="w-full max-h-96 object-contain rounded-2xl"
              />
              <button
                onClick={handleVerify}
                disabled={verifying}
                className="w-full mt-6 bg-gradient-to-r from-purple-600 to-pink-500 text-white py-4 rounded-xl font-semibold hover:shadow-lg hover:shadow-purple-500/30 transition-all disabled:opacity-50"
              >
                {verifying ? "Verifying..." : "Verify Authenticity"}
              </button>
            </div>
          )}
        </div>

        {/* Result Card */}
        {result && (
          <div className="bg-white rounded-3xl shadow-xl p-8 animate-in fade-in slide-in-from-bottom-4 duration-500 border border-purple-100/50">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Verification Results</h2>

            {/* Overall Status */}
            <div className={`rounded-2xl p-6 mb-6 ${
              result.status === "genuine"
                ? "bg-green-50 border-2 border-green-200"
                : "bg-red-50 border-2 border-red-200"
            }`}>
              <div className="flex items-center gap-4">
                {result.status === "genuine" ? (
                  <CheckCircle className="size-12 text-green-600" />
                ) : (
                  <XCircle className="size-12 text-red-600" />
                )}
                <div className="flex-1">
                  <h3 className={`text-2xl font-bold ${
                    result.status === "genuine" ? "text-green-900" : "text-red-900"
                  }`}>
                    {result.status === "genuine" ? "Genuine Craft" : "Authenticity Questionable"}
                  </h3>
                  <p className={`text-sm ${
                    result.status === "genuine" ? "text-green-700" : "text-red-700"
                  }`}>
                    Confidence: {result.confidence}%
                  </p>
                </div>
              </div>
            </div>

            {/* Authenticity Score */}
            <div className="mb-6">
              <label className="text-sm text-gray-500 mb-2 block">Overall Authenticity Score</label>
              <div className="flex items-center gap-4">
                <div className="flex-1 h-4 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-purple-600 to-pink-500 rounded-full transition-all duration-1000"
                    style={{ width: `${result.score}%` }}
                  />
                </div>
                <span className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent">
                  {result.score}%
                </span>
              </div>
            </div>

            {/* Detailed Analysis */}
            <div className="space-y-4">
              <h4 className="font-semibold text-gray-900">Detailed Analysis</h4>
              
              {Object.entries(result.details).map(([key, value]) => (
                <div key={key}>
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-sm text-gray-600 capitalize">
                      {key.replace(/([A-Z])/g, " $1").trim()}
                    </label>
                    <span className="text-sm font-semibold text-gray-900">{value}%</span>
                  </div>
                  <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-purple-400 to-pink-400 rounded-full"
                      style={{ width: `${value}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}