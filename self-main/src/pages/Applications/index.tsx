import React, { useState, useMemo } from 'react';
import { Card } from '../../components/common/Card';
import { Input, Select, Textarea } from '../../components/common/FormComponents';
import { FileUpload } from '../../components/common/FileUpload';
import { Button } from '../../components/common/Button';
import { DataTable } from '../../components/common/DataTable';
import { applicationService, type ProjectProposalPayload } from '../../services/applicationService';
import { SCHEMES, STATES, type Scheme } from '../../constants/mockData';
import { Plus, Trash2, FileText, CheckCircle2, ChevronRight, ListCollapse, Calculator } from 'lucide-react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

// Zod Validation Schema for Project Proposal
const proposalSchema = z.object({
  title: z.string().min(5, 'Project Title must be at least 5 characters.'),
  schemeId: z.string().min(1, 'Please select a funding scheme.'),
  abstract: z.string().min(10, 'Project abstract must be at least 10 characters.'),
  state: z.string().min(1, 'Please select a targeted state.'),
  district: z.string().min(1, 'Target district is required.'),
  block: z.string().min(1, 'Target block is required.'),
  villages: z.string().min(1, 'Target village listings are required.'),
  
  // Beneficiaries
  maleCount: z.number().min(0, 'Must be positive'),
  femaleCount: z.number().min(0, 'Must be positive'),
  stCount: z.number().min(0, 'Must be positive'),

  // Budget
  budget: z.array(z.object({
    category: z.string().min(1, 'Category is required.'),
    description: z.string().min(2, 'Description is required.'),
    quantity: z.number().min(1, 'Qty must be at least 1.'),
    unitCost: z.number().min(1, 'Cost must be positive.'),
  })).min(1, 'Please add at least one budget item row.'),

  activities: z.string().min(10, 'Activity schedule details required.'),
  expectedOutcomes: z.string().min(10, 'Expected outcome details required.'),
  declarationChecked: z.boolean().refine((val) => val === true, 'You must agree to the legal declaration.'),
});

type ProposalFormData = z.infer<typeof proposalSchema>;

export const Applications: React.FC = () => {
  // Navigation sub-views: 'list' or 'new'
  const [view, setView] = useState<'list' | 'new'>('list');
  const [activeTab, setActiveTab] = useState<'info' | 'location' | 'budget' | 'submit'>('info');

  // Load active applications mock database lists
  const [applications, setApplications] = useState<any[]>([
    {
      applicationId: 'NGO-2026-00124',
      title: 'Mobile Healthcare Clinic Jharkhand Phase 2',
      schemeName: 'Mobile Medical Units (MMU) in Scheduled Areas',
      status: 'Proposal Submitted',
      submittedAt: '2026-08-20',
      grantRequested: '₹40.00 Lakhs',
    },
    {
      applicationId: 'NGO-2026-00941',
      title: 'Smart Classrooms Setup for ST Students',
      schemeName: 'Eklavya Model Residential Schools Support (EMRS)',
      status: 'Sanctioned',
      submittedAt: '2026-03-05',
      grantRequested: '₹50.00 Lakhs',
    }
  ]);

  const isLoadingList = false;
  const [uploadedProposalPDF, setUploadedProposalPDF] = useState<File | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState<string | null>(null);

  // Form setup
  const {
    register,
    control,
    handleSubmit,
    getValues,
    watch,
    trigger,
    formState: { errors, isSubmitting }
  } = useForm<ProposalFormData>({
    resolver: zodResolver(proposalSchema),
    defaultValues: {
      title: '',
      schemeId: '',
      abstract: '',
      state: 'Jharkhand',
      district: 'Ranchi',
      block: 'Kanke',
      villages: 'Pithoria, Boreya',
      maleCount: 250,
      femaleCount: 300,
      stCount: 450,
      budget: [
        { category: 'recurring', description: 'Staff Salaries (Medical Officers)', quantity: 1, unitCost: 1500000 }
      ],
      activities: 'Procure mobile clinic medical vans, deploy paramedical staff, run diagnostics schedules twice a week.',
      expectedOutcomes: 'Direct primary health consultations and medicine distributions to 500+ ST households.',
      declarationChecked: false
    }
  });

  // Field arrays for dynamic budget row additions
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'budget'
  });

  // Watch budget inputs to calculate row totals and project grand totals automatically
  const watchedBudget = watch('budget');
  
  const budgetCalculations = useMemo(() => {
    let grandTotal = 0;
    const rows = (watchedBudget || []).map((item) => {
      const q = Number(item?.quantity) || 0;
      const c = Number(item?.unitCost) || 0;
      const rowTotal = q * c;
      grandTotal += rowTotal;
      return rowTotal;
    });
    return { rows, grandTotal };
  }, [watchedBudget]);

  const handleNextTab = async (next: 'location' | 'budget' | 'submit') => {
    let fieldsToValidate: (keyof ProposalFormData)[] = [];
    if (next === 'location') {
      fieldsToValidate = ['title', 'schemeId', 'abstract'];
    } else if (next === 'budget') {
      fieldsToValidate = ['state', 'district', 'block', 'villages', 'maleCount', 'femaleCount', 'stCount'];
    } else if (next === 'submit') {
      fieldsToValidate = ['budget'];
    }
    
    const isValid = await trigger(fieldsToValidate);
    if (isValid) {
      setActiveTab(next);
    }
  };

  const handleProposalSubmit = async (data: ProposalFormData) => {
    try {
      const selectedScheme = SCHEMES.find((s: Scheme) => s.id === data.schemeId);
      const payload: ProjectProposalPayload = {
        title: data.title,
        schemeId: data.schemeId,
        schemeName: selectedScheme?.title || 'Consolidated ST Grant',
        abstract: data.abstract,
        state: data.state,
        district: data.district,
        block: data.block,
        villages: data.villages,
        beneficiaries: {
          maleCount: data.maleCount,
          femaleCount: data.femaleCount,
          totalCount: data.maleCount + data.femaleCount,
          stCount: data.stCount
        },
        budget: data.budget.map((item, idx) => ({
          ...item,
          total: budgetCalculations.rows[idx]
        })),
        activities: data.activities,
        expectedOutcomes: data.expectedOutcomes,
        declarationChecked: data.declarationChecked
      };

      const response = await applicationService.submitProposal(payload);
      setSubmitSuccess(response.applicationId);
      
      // Add locally to applications list
      setApplications(prev => [
        {
          applicationId: response.applicationId,
          title: payload.title,
          schemeName: payload.schemeName,
          status: 'Proposal Submitted',
          submittedAt: new Date().toISOString().split('T')[0],
          grantRequested: `₹${(budgetCalculations.grandTotal / 100000).toFixed(2)} Lakhs`,
        },
        ...prev
      ]);

    } catch (error) {
      console.error(error);
    }
  };

  const resetProposalForm = () => {
    setView('list');
    setSubmitSuccess(null);
    setActiveTab('info');
  };

  return (
    <div className="space-y-6">
      
      {/* Dynamic View Toggles */}
      <div className="flex justify-between items-center bg-white border border-gov-border rounded-lg p-4 shadow-sm select-none">
        <div>
          <h2 className="text-base font-bold text-gov-charcoal">
            {view === 'list' ? 'Active Grant Proposals' : 'Submit Project Proposal'}
          </h2>
          <p className="text-xs text-gov-muted mt-0.5">
            {view === 'list' ? 'Overview of project applications submitted.' : 'Enter budget sheets and targeted coordinates.'}
          </p>
        </div>

        <div className="flex gap-2">
          {view === 'list' ? (
            <Button size="sm" variant="secondary" onClick={() => setView('new')} className="gap-1.5 font-semibold">
              <Plus className="h-4 w-4" /> Submit Proposal
            </Button>
          ) : (
            <Button size="sm" variant="outline" onClick={resetProposalForm} className="gap-1.5 font-semibold">
              <ListCollapse className="h-4 w-4" /> View Proposals List
            </Button>
          )}
        </div>
      </div>

      {/* VIEW 1: APPLICATIONS LIST TABLE */}
      {view === 'list' && (
        <DataTable
          headers={['Proposal Reference', 'Project Details', 'Grant Requested', 'Processing Stage', 'Submission Date']}
          data={applications}
          isLoading={isLoadingList}
          renderRow={(app) => (
            <>
              {/* Reference */}
              <td className="px-5 py-4 font-bold text-xs text-gov-navy select-all">
                {app.applicationId}
              </td>
              {/* Title & Scheme */}
              <td className="px-5 py-4 min-w-[280px]">
                <div>
                  <h4 className="font-bold text-sm text-gov-charcoal">{app.title}</h4>
                  <span className="text-[10px] text-gov-muted uppercase font-medium mt-0.5 block">{app.schemeName}</span>
                </div>
              </td>
              {/* Grant requested */}
              <td className="px-5 py-4 text-xs font-semibold text-gov-charcoal select-none">
                {app.grantRequested}
              </td>
              {/* Status */}
              <td className="px-5 py-4 select-none">
                <span className={`inline-block text-[10px] font-bold px-2 py-0.5 rounded border ${
                  app.status === 'Sanctioned'
                    ? 'bg-green-50 text-gov-success border-green-200'
                    : 'bg-blue-50 text-gov-navy border-blue-200 animate-pulse'
                }`}>
                  {app.status}
                </span>
              </td>
              {/* Submission Date */}
              <td className="px-5 py-4 text-xs text-gov-muted">
                {app.submittedAt}
              </td>
            </>
          )}
        />
      )}

      {/* VIEW 2: NEW PROPOSAL SUBMISSION FORM */}
      {view === 'new' && (
        <Card className="bg-white border border-gov-border shadow-md p-6">
          {submitSuccess ? (
            /* SUCCESS SUBMIT SCREEN */
            <div className="text-center py-10 space-y-4 animate-fadeIn select-none">
              <CheckCircle2 className="h-16 w-16 text-gov-success mx-auto" />
              <div className="space-y-1">
                <h3 className="text-lg font-bold text-gov-charcoal">Proposal Submitted Successfully!</h3>
                <p className="text-xs text-gov-muted max-w-sm mx-auto">
                  A unique project application reference ID has been created:
                </p>
                <div className="bg-gov-bg-alt border border-gov-border rounded px-4 py-2 font-mono font-bold text-base text-gov-navy max-w-xs mx-auto mt-2 select-all">
                  {submitSuccess}
                </div>
              </div>
              <p className="text-xs text-gov-muted max-w-sm mx-auto leading-relaxed">
                Your project proposal will be routed to District welfare offices for verification checks. Check status regularly on the tracking page.
              </p>
              <div className="pt-4 flex gap-2 justify-center">
                <Button variant="outline" size="sm" onClick={resetProposalForm}>Back to Dashboard</Button>
              </div>
            </div>
          ) : (
            /* WIZARD SUB-TABS APPLICATION FORM */
            <div className="space-y-6">
              
              {/* Wizard Tabs Indicator */}
              <div className="flex border-b border-gov-border -mx-6 mb-6 select-none bg-gov-bg-alt text-xs font-semibold">
                <button
                  type="button"
                  onClick={() => activeTab !== 'info' && setActiveTab('info')}
                  className={`flex-1 py-3 text-center border-b-2 ${
                    activeTab === 'info' ? 'border-b-gov-navy text-gov-navy bg-white font-bold' : 'border-b-transparent text-gov-muted'
                  }`}
                >
                  1. Project Info
                </button>
                <button
                  type="button"
                  onClick={() => activeTab !== 'location' && handleNextTab('location')}
                  className={`flex-1 py-3 text-center border-b-2 ${
                    activeTab === 'location' ? 'border-b-gov-navy text-gov-navy bg-white font-bold' : 'border-b-transparent text-gov-muted'
                  }`}
                >
                  2. Targeted Location
                </button>
                <button
                  type="button"
                  onClick={() => activeTab !== 'budget' && handleNextTab('budget')}
                  className={`flex-1 py-3 text-center border-b-2 ${
                    activeTab === 'budget' ? 'border-b-gov-navy text-gov-navy bg-white font-bold' : 'border-b-transparent text-gov-muted'
                  }`}
                >
                  3. Budget Calculator
                </button>
                <button
                  type="button"
                  onClick={() => activeTab !== 'submit' && handleNextTab('submit')}
                  className={`flex-1 py-3 text-center border-b-2 ${
                    activeTab === 'submit' ? 'border-b-gov-navy text-gov-navy bg-white font-bold' : 'border-b-transparent text-gov-muted'
                  }`}
                >
                  4. Review & Submit
                </button>
              </div>

              <form onSubmit={handleSubmit(handleProposalSubmit)} className="space-y-6">
                
                {/* SUBTAB 1: PROJECT DETAILS */}
                {activeTab === 'info' && (
                  <div className="space-y-4 animate-fadeIn">
                    <h3 className="text-sm font-bold text-gov-charcoal border-b border-gov-border pb-2 flex items-center gap-1.5">
                      <FileText className="h-4.5 w-4.5 text-gov-navy" /> Project Core Information
                    </h3>

                    <Input
                      label="Project Proposal Title"
                      placeholder="e.g. Mobile Healthcare Clinics in remote tribal blocks"
                      required
                      error={errors.title?.message}
                      {...register('title')}
                    />

                    <Select
                      label="Funding Grant Scheme"
                      required
                      placeholder="Select scheme"
                      options={SCHEMES.map((s: Scheme) => ({ value: s.id, label: s.title }))}
                      error={errors.schemeId?.message}
                      {...register('schemeId')}
                    />

                    <Textarea
                      label="Project Abstract & Objectives"
                      placeholder="Summarize target achievements and implementation workflow..."
                      rows={5}
                      required
                      error={errors.abstract?.message}
                      {...register('abstract')}
                    />

                    <div className="flex justify-end pt-4">
                      <Button
                        type="button"
                        variant="primary"
                        size="sm"
                        onClick={() => handleNextTab('location')}
                        className="gap-1 font-semibold"
                      >
                        Next Step <ChevronRight className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                )}

                {/* SUBTAB 2: LOCATION & DEMOGRAPHICS */}
                {activeTab === 'location' && (
                  <div className="space-y-4 animate-fadeIn">
                    <h3 className="text-sm font-bold text-gov-charcoal border-b border-gov-border pb-2 flex items-center gap-1.5">
                      Targeted Location & Demographic Profiles
                    </h3>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <Select
                        label="Target State"
                        required
                        options={STATES.filter(s => s !== 'All States').map(s => ({ value: s, label: s }))}
                        error={errors.state?.message}
                        {...register('state')}
                      />
                      <Input
                        label="Target District"
                        required
                        error={errors.district?.message}
                        {...register('district')}
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <Input
                        label="Target Blocks"
                        required
                        error={errors.block?.message}
                        {...register('block')}
                      />
                      <Input
                        label="Target Villages (Comma-separated list)"
                        required
                        error={errors.villages?.message}
                        {...register('villages')}
                      />
                    </div>

                    {/* Beneficiaries */}
                    <div className="bg-gov-bg-alt p-4 rounded-lg border border-gov-border space-y-3">
                      <span className="font-bold text-gov-navy text-xs uppercase block border-b border-gov-border/50 pb-1">
                        Expected Beneficiary Demographics
                      </span>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <Input
                          label="Male Beneficiaries"
                          type="number"
                          required
                          error={errors.maleCount?.message}
                          {...register('maleCount', { valueAsNumber: true })}
                        />
                        <Input
                          label="Female Beneficiaries"
                          type="number"
                          required
                          error={errors.femaleCount?.message}
                          {...register('femaleCount', { valueAsNumber: true })}
                        />
                        <Input
                          label="ST Beneficiaries Count"
                          type="number"
                          required
                          error={errors.stCount?.message}
                          {...register('stCount', { valueAsNumber: true })}
                        />
                      </div>
                    </div>

                    <div className="flex justify-between pt-4 select-none">
                      <Button type="button" variant="outline" size="sm" onClick={() => setActiveTab('info')}>
                        Previous
                      </Button>
                      <Button type="button" variant="primary" size="sm" onClick={() => handleNextTab('budget')} className="gap-1 font-semibold">
                        Next Step <ChevronRight className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                )}

                {/* SUBTAB 3: DYNAMIC BUDGET BUILDER */}
                {activeTab === 'budget' && (
                  <div className="space-y-4 animate-fadeIn">
                    <h3 className="text-sm font-bold text-gov-charcoal border-b border-gov-border pb-2 flex items-center gap-1.5 justify-between">
                      <span className="flex items-center gap-1.5"><Calculator className="h-4.5 w-4.5 text-gov-navy" /> Itemized Budget Builder</span>
                      <span className="text-xs font-bold text-gov-saffron bg-gov-saffron-light border border-gov-saffron/10 px-2 py-0.5 rounded">
                        Grand Total: ₹{(budgetCalculations.grandTotal / 100000).toFixed(2)} Lakhs
                      </span>
                    </h3>

                    {/* Budget row builder table */}
                    <div className="w-full border border-gov-border rounded-lg overflow-hidden bg-white shadow-sm">
                      <div className="w-full overflow-x-auto custom-scrollbar">
                        <table className="w-full text-left border-collapse text-xs select-none">
                          <thead>
                            <tr className="bg-gov-bg-alt border-b border-gov-border text-gov-charcoal font-semibold">
                              <th className="px-3 py-2 w-32">Category</th>
                              <th className="px-3 py-2">Item Description</th>
                              <th className="px-3 py-2 w-20">Quantity</th>
                              <th className="px-3 py-2 w-28">Unit Cost (₹)</th>
                              <th className="px-3 py-2 w-28">Total (₹)</th>
                              <th className="px-3 py-2 w-12 text-center">Action</th>
                            </tr>
                          </thead>
                          <tbody>
                            {fields.map((field, idx) => (
                              <tr key={field.id} className="border-b border-gov-border last:border-0 hover:bg-gov-bg-alt/10">
                                {/* Category */}
                                <td className="px-3 py-2">
                                  <select
                                    {...register(`budget.${idx}.category` as const)}
                                    className="px-2 py-1.5 border border-gov-border rounded bg-white text-xs w-full outline-none"
                                  >
                                    <option value="recurring">Recurring</option>
                                    <option value="non-recurring">Non-Recurring</option>
                                    <option value="contingency">Contingency</option>
                                  </select>
                                </td>
                                {/* Description */}
                                <td className="px-3 py-2">
                                  <input
                                    {...register(`budget.${idx}.description` as const)}
                                    placeholder="e.g. Purchase of diagnostic medical kit"
                                    className="px-2 py-1.5 border border-gov-border rounded text-xs w-full outline-none"
                                  />
                                </td>
                                {/* Quantity */}
                                <td className="px-3 py-2">
                                  <input
                                    type="number"
                                    {...register(`budget.${idx}.quantity` as const, { valueAsNumber: true })}
                                    className="px-2 py-1.5 border border-gov-border rounded text-xs w-full outline-none"
                                  />
                                </td>
                                {/* Unit Cost */}
                                <td className="px-3 py-2">
                                  <input
                                    type="number"
                                    {...register(`budget.${idx}.unitCost` as const, { valueAsNumber: true })}
                                    className="px-2 py-1.5 border border-gov-border rounded text-xs w-full outline-none font-mono"
                                  />
                                </td>
                                {/* Calculated total */}
                                <td className="px-3 py-2 font-semibold text-gov-navy font-mono text-[11px] select-all">
                                  {(budgetCalculations.rows[idx] || 0).toLocaleString('en-IN')}
                                </td>
                                {/* Action delete */}
                                <td className="px-3 py-2 text-center">
                                  <button
                                    type="button"
                                    onClick={() => fields.length > 1 && remove(idx)}
                                    disabled={fields.length === 1}
                                    className="p-1.5 text-gov-muted hover:text-gov-error disabled:opacity-30 disabled:cursor-not-allowed rounded"
                                    title="Delete Row"
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => append({ category: 'recurring', description: '', quantity: 1, unitCost: 10000 })}
                      className="text-xs font-semibold text-gov-navy hover:text-gov-navy-hover flex items-center gap-1 mt-1 select-none"
                    >
                      <Plus className="h-4 w-4" /> Add Budget Item Row
                    </button>

                    {errors.budget?.message && (
                      <span className="text-xs text-gov-error font-medium block" role="alert">
                        {errors.budget.message}
                      </span>
                    )}

                    <div className="flex justify-between pt-4 select-none">
                      <Button type="button" variant="outline" size="sm" onClick={() => setActiveTab('location')}>
                        Previous
                      </Button>
                      <Button type="button" variant="primary" size="sm" onClick={() => handleNextTab('submit')} className="gap-1 font-semibold">
                        Next Step <ChevronRight className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                )}

                {/* SUBTAB 4: FINAL DECLARATION & SUBMIT */}
                {activeTab === 'submit' && (
                  <div className="space-y-6 animate-fadeIn">
                    <h3 className="text-sm font-bold text-gov-charcoal border-b border-gov-border pb-2">
                      Review & Upload Proposal Attachments
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs md:text-sm">
                      {/* Project Profile Summary */}
                      <div className="bg-gov-bg-alt p-4 rounded-lg border border-gov-border space-y-2">
                        <span className="font-bold text-gov-navy text-xs uppercase block border-b border-gov-border/50 pb-1">
                          Project Profile Details
                        </span>
                        <p><span className="font-semibold text-gov-charcoal">Title:</span> {getValues('title')}</p>
                        <p><span className="font-semibold text-gov-charcoal">State/Dist:</span> {getValues('state')} / {getValues('district')}</p>
                        <p><span className="font-semibold text-gov-charcoal">Blocks/Villages:</span> {getValues('block')} ({getValues('villages')})</p>
                      </div>

                      {/* Budget Summary */}
                      <div className="bg-gov-bg-alt p-4 rounded-lg border border-gov-border space-y-2 flex flex-col justify-between">
                        <div>
                          <span className="font-bold text-gov-navy text-xs uppercase block border-b border-gov-border/50 pb-1">
                            Budget Summary Details
                          </span>
                          <p className="mt-2"><span className="font-semibold text-gov-charcoal">Total Items:</span> {watchedBudget?.length} rows</p>
                        </div>
                        <div className="text-base font-bold text-gov-saffron bg-white border border-gov-border px-3 py-1.5 rounded mt-2 self-start select-all">
                          Total Budget: ₹{(budgetCalculations.grandTotal / 100000).toFixed(2)} Lakhs
                        </div>
                      </div>
                    </div>

                    {/* PDF Document Upload */}
                    <div className="max-w-md">
                      <FileUpload
                        label="Mandatory Detailed Project Report (DPR PDF)"
                        accept=".pdf"
                        required
                        onFileSelect={setUploadedProposalPDF}
                      />
                    </div>

                    {/* Legal Declaration */}
                    <div className="bg-slate-50 border border-gov-border rounded-lg p-4 flex gap-3 items-start select-none">
                      <input
                        type="checkbox"
                        id="declarationChecked"
                        className="rounded border-gov-border text-gov-navy focus:ring-gov-navy mt-1 cursor-pointer"
                        {...register('declarationChecked')}
                      />
                      <label htmlFor="declarationChecked" className="text-xs text-gov-muted leading-relaxed cursor-pointer select-none">
                        <span className="font-bold text-gov-charcoal block mb-0.5">Official Legal Declaration</span>
                        I hereby declare that Vikas Kalyan Sansthan is fully authorized to execute this project. Budget estimates represent actual cost parameters. GEOTagged audit logs will be submitted during progress milestones. We agree that audit mismatch leads to project suspension.
                      </label>
                    </div>

                    {errors.declarationChecked?.message && (
                      <span className="text-xs text-gov-error font-medium block" role="alert">
                        {errors.declarationChecked.message}
                      </span>
                    )}

                    <div className="flex justify-between pt-4 select-none">
                      <Button type="button" variant="outline" size="sm" onClick={() => setActiveTab('budget')}>
                        Previous
                      </Button>
                      <Button
                        type="submit"
                        variant="secondary"
                        isLoading={isSubmitting}
                        disabled={!uploadedProposalPDF}
                        className="font-semibold shadow-md"
                      >
                        Submit Proposal Scheme
                      </Button>
                    </div>
                  </div>
                )}

              </form>

            </div>
          )}
        </Card>
      )}

    </div>
  );
};
