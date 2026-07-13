import React, { useState } from 'react';
import { Award, User, FileText, ArrowRight, ArrowLeft, Mail, Phone, MapPin, Check } from 'lucide-react';
import { submitForm } from '../utils/api';

export default function AwardNominations({ onSubmitSuccess }) {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    nominatorName: '',
    nominatorEmail: '',
    nominatorPhone: '',
    nominatorRelation: '',
    nomineeName: '',
    nomineeEmail: '',
    nomineePhone: '',
    nomineeLocation: '',
    category: 'seva_ratna',
    sevaSummary: '',
    impactMetrics: '',
    references: ''
  });

  const categories = {
    seva_ratna: {
      title: 'Seva Ratna',
      subtitle: 'Lifetime Achievement in Social Service',
      desc: 'Honoring individuals who have dedicated 15+ years to selfless community service and uplifting marginalized sectors.'
    },
    sanskriti_vibhushan: {
      title: 'Sanskriti Vibhushan',
      subtitle: 'Ancient Heritage & Arts Restoration',
      desc: 'Recognizing outstanding dedication to preserving traditional arts, ancient literature, scriptural documentation, or historical temple architecture.'
    },
    prakriti_mitra: {
      title: 'Prakriti Mitra',
      subtitle: 'Environmental Restoration Leadership',
      desc: 'Given to grassroots leaders restoring water bodies, implementing mass organic farming, afforestation, or waste management models.'
    },
    arogya_shiromani: {
      title: 'Arogya Shiromani',
      subtitle: 'Community Healthcare & Yoga Leadership',
      desc: 'Acknowledging medical professionals or institutions who provide free healthcare, organize health campaigns, or promote yoga and holistic health in rural sectors.'
    },
    vidya_prabha: {
      title: 'Vidya Prabha',
      subtitle: 'Educational Upliftment Award',
      desc: 'Saluting teachers or organizers establishing path-breaking educational projects for street children, rural girls, or tribal communities.'
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleNext = () => {
    if (step === 1) {
      if (!formData.nominatorName || !formData.nominatorEmail || !formData.nominatorPhone) {
        alert('Please fill in all nominator details.');
        return;
      }
      setStep(2);
    } else if (step === 2) {
      if (!formData.nomineeName || !formData.nomineeLocation) {
        alert('Please fill in the nominee name and location.');
        return;
      }
      setStep(3);
    }
  };

  const handleBack = () => {
    setStep(prev => prev - 1);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.sevaSummary) {
      alert('Please fill in the Seva Summary of the nominee.');
      return;
    }

    const submission = {
      ...formData,
      categoryTitle: categories[formData.category].title
    };

    submitForm('Award Nominations', submission);

    onSubmitSuccess({
      title: 'Nomination Submitted Successfully',
      message: `Pranam, ${formData.nominatorName}. Your nomination of ${formData.nomineeName} for the prestigious "${categories[formData.category].title}" award has been received. Our jury consisting of eminent spiritual leaders and social workers will evaluate the Seva Summary. We will notify both you and the nominee if selected for the shortlist.`,
      details: [
        { label: 'Nominator', value: formData.nominatorName },
        { label: 'Nominee', value: formData.nomineeName },
        { label: 'Category', value: categories[formData.category].title }
      ]
    });
  };

  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
      <div className="text-center mb-12">
        <span className="text-sun-gold font-semibold uppercase tracking-wider text-sm font-sans font-semibold">Honoring Selfless Souls</span>
        <h2 className="text-4xl font-serif text-forest-teal-dark mt-2 mb-4">Divine Awards 2025 Nominations</h2>
        <p className="text-neutral-600 max-w-2xl mx-auto font-sans">
          Do you know a silent hero who does outstanding seva without seeking recognition? Nominate them today to shine a light on their noble deeds.
        </p>
      </div>

      <div className="max-w-4xl mx-auto mb-10">
        <div className="flex items-center justify-between relative">
          <div className="absolute left-0 right-0 top-1/2 h-0.5 bg-neutral-200 -z-10"></div>
          {[1, 2, 3].map((num) => (
            <div
              key={num}
              className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-300 font-sans z-10 ${
                step === num
                  ? 'bg-sun-gold text-forest-teal-dark ring-4 ring-amber-100'
                  : step > num
                  ? 'bg-forest-teal text-white'
                  : 'bg-white border border-neutral-300 text-neutral-400'
              }`}
            >
              {step > num ? <Check className="w-5 h-5" /> : num}
            </div>
          ))}
        </div>
        <div className="flex justify-between mt-2.5 text-xs text-neutral-500 font-sans px-2">
          <span>1. Nominator Details</span>
          <span className="pr-4">2. Nominee & Category</span>
          <span>3. Seva Contribution Summary</span>
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-neutral-100 shadow-premium p-8 max-w-3xl mx-auto">
        {step === 1 && (
          <div className="space-y-6">
            <h3 className="text-xl font-serif text-forest-teal-dark border-b border-neutral-100 pb-3 flex items-center">
              <User className="w-5 h-5 text-sun-gold mr-2" />
              Step 1: Your Information (Nominator)
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-forest-teal mb-2 font-sans">Your Full Name *</label>
                <input
                  type="text"
                  name="nominatorName"
                  required
                  placeholder="Aditi Sharma"
                  value={formData.nominatorName}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-forest-teal text-sm font-sans"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-forest-teal mb-2 font-sans">Relation to Nominee *</label>
                <input
                  type="text"
                  name="nominatorRelation"
                  required
                  placeholder="Colleague / Student / Beneficiary / Co-worker"
                  value={formData.nominatorRelation}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-forest-teal text-sm font-sans"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-forest-teal mb-2 font-sans">Your Email Address *</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3.5 w-4 h-4 text-neutral-400" />
                  <input
                    type="email"
                    name="nominatorEmail"
                    required
                    placeholder="aditi@example.com"
                    value={formData.nominatorEmail}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-forest-teal text-sm font-sans"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-forest-teal mb-2 font-sans">Your Phone Number *</label>
                <div className="relative">
                  <Phone className="absolute left-3 top-3.5 w-4 h-4 text-neutral-400" />
                  <input
                    type="tel"
                    name="nominatorPhone"
                    required
                    placeholder="+91 88888 77777"
                    value={formData.nominatorPhone}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-forest-teal text-sm font-sans"
                  />
                </div>
              </div>
            </div>

            <div className="pt-4 flex justify-end">
              <button
                type="button"
                onClick={handleNext}
                className="py-3 px-6 rounded-xl bg-gradient-to-r from-[var(--color-saffron-glow)] to-[var(--color-saffron-glow-dark)] text-[#281006] hover:brightness-105 font-sans font-bold text-sm transition-all duration-300 flex items-center space-x-2 cursor-pointer group shadow-md"
              >
                <span>Continue</span>
                <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
              </button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6">
            <h3 className="text-xl font-serif text-forest-teal-dark border-b border-neutral-100 pb-3 flex items-center">
              <Award className="w-5 h-5 text-sun-gold mr-2" />
              Step 2: Nominee & Award Category
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-forest-teal mb-2 font-sans">Nominee's Name *</label>
                <input
                  type="text"
                  name="nomineeName"
                  required
                  placeholder="Baba Balbir Singh Ji"
                  value={formData.nomineeName}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-forest-teal text-sm font-sans"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-forest-teal mb-2 font-sans">Nominee's Location *</label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-3.5 w-4 h-4 text-neutral-400" />
                  <input
                    type="text"
                    name="nomineeLocation"
                    required
                    placeholder="Sultanpur Lodhi, Punjab"
                    value={formData.nomineeLocation}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-forest-teal text-sm font-sans"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-forest-teal mb-2 font-sans">Nominee's Email (Optional)</label>
                <input
                  type="email"
                  name="nomineeEmail"
                  placeholder="nominee@example.com"
                  value={formData.nomineeEmail}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-forest-teal text-sm font-sans"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-forest-teal mb-2 font-sans">Nominee's Phone (Optional)</label>
                <input
                  type="tel"
                  name="nomineePhone"
                  placeholder="+91 99999 77777"
                  value={formData.nomineePhone}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-forest-teal text-sm font-sans"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-forest-teal mb-2 font-sans">Award Category</label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-forest-teal text-sm font-sans bg-white"
              >
                {Object.entries(categories).map(([key, cat]) => (
                  <option key={key} value={key}>{cat.title} ({cat.subtitle})</option>
                ))}
              </select>
            </div>

            <div className="p-4 bg-[#FDFBF7] rounded-2xl border border-sage-accent/40 text-xs font-sans text-neutral-600">
              <strong className="text-forest-teal-dark block mb-1">Category Criteria:</strong>
              {categories[formData.category].desc}
            </div>

            <div className="pt-4 flex justify-between">
              <button
                type="button"
                onClick={handleBack}
                className="py-3 px-6 rounded-xl border border-neutral-300 text-neutral-600 hover:bg-neutral-50 font-sans font-semibold text-sm transition-all duration-300 flex items-center space-x-2 cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back</span>
              </button>

              <button
                type="button"
                onClick={handleNext}
                className="py-3 px-6 rounded-xl bg-gradient-to-r from-[var(--color-saffron-glow)] to-[var(--color-saffron-glow-dark)] text-[#281006] hover:brightness-105 font-sans font-bold text-sm transition-all duration-300 flex items-center space-x-2 cursor-pointer group shadow-md"
              >
                <span>Continue</span>
                <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
              </button>
            </div>
          </div>
        )}

        {step === 3 && (
          <form onSubmit={handleSubmit} className="space-y-6">
            <h3 className="text-xl font-serif text-forest-teal-dark border-b border-neutral-100 pb-3 flex items-center">
              <FileText className="w-5 h-5 text-sun-gold mr-2" />
              Step 3: Seva Contribution Summary
            </h3>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-forest-teal mb-2 font-sans">
                Contribution Description / Seva Summary *
              </label>
              <textarea
                name="sevaSummary"
                required
                rows="6"
                placeholder="Detail the selfless acts, activities, or systemic impacts that the nominee has accomplished. Include historical timelines, populations served, and why they deserve this prestigious honor..."
                value={formData.sevaSummary}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-forest-teal text-sm font-sans"
              ></textarea>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-forest-teal mb-2 font-sans">
                Quantifiable Impact / Metrics (Optional)
              </label>
              <textarea
                name="impactMetrics"
                rows="3"
                placeholder="E.g., Planted 50,000 trees, fed 10,000 kids during pandemic, cleared 150km of choked riverbed..."
                value={formData.impactMetrics}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-forest-teal text-sm font-sans"
              ></textarea>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-forest-teal mb-2 font-sans">
                Supporting Links / References
              </label>
              <input
                type="text"
                name="references"
                placeholder="Google Drive folder, website links, news article links separated by commas"
                value={formData.references}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-forest-teal text-sm font-sans"
              />
            </div>

            <div className="pt-4 flex justify-between">
              <button
                type="button"
                onClick={handleBack}
                className="py-3 px-6 rounded-xl border border-neutral-300 text-neutral-600 hover:bg-neutral-50 font-sans font-semibold text-sm transition-all duration-300 flex items-center space-x-2 cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back</span>
              </button>

              <button
                type="submit"
                className="py-3 px-8 rounded-xl bg-gradient-to-r from-[var(--color-saffron-glow)] to-[var(--color-saffron-glow-dark)] text-[#281006] hover:brightness-105 font-sans font-bold text-sm transition-all duration-300 flex items-center space-x-2 border-2 border-transparent hover:border-[#281006] cursor-pointer group shadow-lg hover:shadow-xl hover:-translate-y-0.5"
              >
                <span>Submit Nomination</span>
                <Check className="w-4 h-4 transition-transform duration-300 group-hover:scale-110" />
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
