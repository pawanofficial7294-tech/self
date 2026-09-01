import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Stepper } from '../../components/common/Stepper';
import { Card } from '../../components/common/Card';
import { Input, Select, Textarea } from '../../components/common/FormComponents';
import { FileUpload } from '../../components/common/FileUpload';
import { Button } from '../../components/common/Button';
import { ngoService } from '../../services/ngoService';
import { ShieldCheck, Info, CheckCircle2, ChevronRight, ChevronLeft, Search } from 'lucide-react';
import { STATES } from '../../constants/mockData';

// Zod Validation Schema for NGO Registration
const registrationSchema = z.object({
  // Step 2: Darpan
  darpanId: z.string().regex(/^[A-Z]{2}\/\d{4}\/\d{7}$/, 'Must be a valid NITI Aayog Darpan ID (e.g. JH/2026/0149201).'),
  
  // Step 1: Org Details
  organizationName: z.string().min(3, 'Organization Name must be at least 3 characters.'),
  registrationNumber: z.string().min(4, 'Registration number is required.'),
  panNumber: z.string().regex(/^[A-Z]{5}\d{4}[A-Z]$/, 'PAN Number must be valid format (e.g. AAATV1298C).'),
  establishmentYear: z.string().regex(/^\d{4}$/, 'Establishment Year must be 4 digits.'),
  
  // Step 3: Contact
  authorizedPerson: z.string().min(2, 'Authorized Person Name is required.'),
  mobile: z.string().regex(/^\d{10}$/, 'Mobile must be 10 digits.'),
  email: z.string().email('Please enter a valid email address.'),
  
  // Step 4: Address
  address: z.string().min(5, 'Address is required.'),
  state: z.string().min(1, 'Please select a state.'),
  district: z.string().min(1, 'District is required.'),
  
  // Step 5: Bank Details
  bankName: z.string().min(2, 'Bank Name is required.'),
  bankAccountNumber: z.string().min(8, 'Bank Account Number is required.'),
  ifscCode: z.string().regex(/^[A-Z]{4}0[A-Z0-9]{6}$/, 'IFSC Code must be valid (e.g. SBIN0000213).'),
});

type RegistrationFormData = z.infer<typeof registrationSchema>;

export const Registration: React.FC = () => {
  
  // Stepper State
  const [currentStep, setCurrentStep] = useState<number>(0);
  const steps = [
    'NGO Darpan',
    'Org Details',
    'Contacts',
    'Address',
    'Bank details',
    'Uploads',
    'Review & Submit'
  ];

  // Verified Darpan status
  const [isDarpanVerified, setIsDarpanVerified] = useState<boolean>(false);
  const [darpanLoading, setDarpanLoading] = useState<boolean>(false);
  const [darpanError, setDarpanError] = useState<string | null>(null);

  // Files state
  const [uploadedPan, setUploadedPan] = useState<File | null>(null);
  const [uploadedDarpan, setUploadedDarpan] = useState<File | null>(null);
  const [uploadedTrust, setUploadedTrust] = useState<File | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);

  // Registration reference number on success
  const [successRefNumber, setSuccessRefNumber] = useState<string | null>(null);

  // Setup form validation
  const {
    register: formRegister,
    handleSubmit,
    trigger,
    getValues,
    setValue,
    formState: { errors, isSubmitting }
  } = useForm<RegistrationFormData>({
    resolver: zodResolver(registrationSchema),
    mode: 'onBlur',
    defaultValues: {
      darpanId: 'JH/2026/0149201', // prefill sample
      organizationName: '',
      registrationNumber: '',
      panNumber: '',
      establishmentYear: '',
      authorizedPerson: 'Rajesh Kumar',
      mobile: '9876543210',
      email: '',
      address: '104, Circular Road, Lalpur',
      state: 'Jharkhand',
      district: 'Ranchi',
      bankName: 'State Bank of India',
      bankAccountNumber: '38290129033',
      ifscCode: 'SBIN0000213'
    }
  });

  // Verify NITI Aayog Darpan ID
  const handleVerifyDarpan = async () => {
    setDarpanError(null);
    const valid = await trigger('darpanId');
    if (!valid) return;

    setDarpanLoading(true);
    try {
      const id = getValues('darpanId');
      // Mock lookup: accepts JH/2026/0149201 or any standard format
      const profile = await ngoService.verifyDarpanId(id.slice(0, 14));
      
      // Auto prefill form values from government registry database
      setValue('organizationName', profile.organizationName);
      setValue('registrationNumber', profile.registrationNumber);
      setValue('establishmentYear', profile.establishmentYear);
      setValue('panNumber', profile.panNumber);
      setValue('email', profile.email);
      setValue('mobile', profile.mobile);
      setValue('state', profile.state);
      setValue('district', profile.district);

      setIsDarpanVerified(true);
    } catch (err: any) {
      setDarpanError(err.message || 'Verification failed. Reference ID not found on NGO Darpan.');
      setIsDarpanVerified(false);
    } finally {
      setDarpanLoading(false);
    }
  };

  // Stepper Navigation
  const handleNextStep = async () => {
    // Validate fields inside active step before proceeding
    let fieldsToValidate: (keyof RegistrationFormData)[] = [];

    switch (currentStep) {
      case 0:
        fieldsToValidate = ['darpanId'];
        break;
      case 1:
        fieldsToValidate = ['organizationName', 'registrationNumber', 'panNumber', 'establishmentYear'];
        break;
      case 2:
        fieldsToValidate = ['authorizedPerson', 'mobile', 'email'];
        break;
      case 3:
        fieldsToValidate = ['address', 'state', 'district'];
        break;
      case 4:
        fieldsToValidate = ['bankName', 'bankAccountNumber', 'ifscCode'];
        break;
    }

    if (currentStep === 0 && !isDarpanVerified) {
      setDarpanError('Please click the verify button to cross-check Darpan records.');
      return;
    }

    const isValid = await trigger(fieldsToValidate);
    
    if (isValid) {
      if (currentStep === 5) {
        // Document upload validation
        if (!uploadedPan || !uploadedDarpan || !uploadedTrust) {
          setUploadError('Please upload all three mandatory documents to proceed.');
          return;
        }
        setUploadError(null);
      }
      setCurrentStep((prev) => prev + 1);
    }
  };

  const handlePrevStep = () => {
    setUploadError(null);
    setCurrentStep((prev) => Math.max(0, prev - 1));
  };

  // Submit full registration form
  const handleRegistrationSubmit = async (data: RegistrationFormData) => {
    try {
      const response = await ngoService.registerNGO({
        ...data,
        documents: {
          panCard: uploadedPan?.name || '',
          darpanCertificate: uploadedDarpan?.name || '',
          trustDeed: uploadedTrust?.name || '',
        }
      });
      setSuccessRefNumber(response.registrationId);
    } catch (err: any) {
      console.error(err);
    }
  };

  return (
    <div className="bg-gov-bg-alt min-h-screen py-10 px-4 md:px-8">
      <div className="max-w-4xl mx-auto space-y-6">
        
        {/* Portal Breadcrumbs & Stepper */}
        <div className="bg-white border border-gov-border rounded-lg p-5 shadow-sm">
          <h2 className="text-xl font-bold text-gov-charcoal uppercase tracking-tight text-center">
            NGO Portal Registration Wizard
          </h2>
          <p className="text-xs text-gov-muted text-center mt-1">
            Complete the 7 verification stages to request login credentials.
          </p>
          <div className="mt-4 border-t border-gov-border pt-2 select-none">
            <Stepper steps={steps} currentStep={currentStep} />
          </div>
        </div>

        {/* Stepper Wizard Forms container */}
        <Card className="bg-white border border-gov-border shadow-md p-6">
          
          {successRefNumber ? (
            /* SUCCESS VIEW ON FINISH */
            <div className="text-center py-10 space-y-5 animate-fadeIn">
              <CheckCircle2 className="h-16 w-16 text-gov-success mx-auto" />
              <div className="space-y-2">
                <h3 className="text-lg md:text-xl font-bold text-gov-charcoal">Registration Request Submitted!</h3>
                <p className="text-xs text-gov-muted max-w-md mx-auto leading-relaxed">
                  Your details have been successfully uploaded to the Ministry database. Application reference ID is:
                </p>
                <div className="bg-gov-bg-alt border border-gov-border rounded px-4 py-2 font-mono font-bold text-base text-gov-navy max-w-xs mx-auto mt-2 tracking-wide">
                  {successRefNumber}
                </div>
              </div>
              <p className="text-xs text-gov-muted max-w-sm mx-auto leading-relaxed">
                Verification visits will be coordinated shortly. Credential keys will be dispatched to your registered email address upon approval.
              </p>
              <div className="pt-4 select-none">
                <Link to="/login">
                  <Button variant="primary" className="font-semibold">Go to Login Workspace</Button>
                </Link>
              </div>
            </div>
          ) : (
            /* ACTIVE FORM STEPS WIZARD */
            <form onSubmit={handleSubmit(handleRegistrationSubmit)} className="space-y-6">
              
              {/* STEP 1: NGO DARPAN LOOKUP */}
              {currentStep === 0 && (
                <div className="space-y-5 animate-fadeIn">
                  <h3 className="text-base font-bold text-gov-charcoal border-b border-gov-border pb-2 flex items-center gap-1.5">
                    <ShieldCheck className="h-5 w-5 text-gov-navy" /> NITI Aayog NGO Darpan Verification
                  </h3>
                  
                  <div className="bg-blue-50/50 border border-blue-100 rounded-md p-3.5 flex items-start gap-2.5">
                    <Info className="h-5 w-5 text-gov-navy flex-shrink-0 mt-0.5" />
                    <p className="text-xs text-gov-muted leading-relaxed">
                      Entering your active NGO Darpan registration ID from the NITI Aayog repository is mandatory. Verifying will auto-prefill your registered name, PAN card number, and establishment date details.
                    </p>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3 items-end">
                    <div className="flex-1 w-full">
                      <Input
                        label="NITI Aayog NGO Darpan ID"
                        placeholder="e.g. JH/2026/0149201"
                        required
                        error={errors.darpanId?.message}
                        {...formRegister('darpanId')}
                      />
                    </div>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleVerifyDarpan}
                      isLoading={darpanLoading}
                      className="w-full sm:w-auto font-semibold gap-1.5 py-2.5 flex-shrink-0"
                    >
                      <Search className="h-4 w-4" /> Verify Darpan ID
                    </Button>
                  </div>

                  {darpanError && (
                    <div className="bg-red-50 border border-red-200 text-gov-error text-xs font-semibold p-3 rounded flex items-center gap-2">
                      <Info className="h-4 w-4" /> {darpanError}
                    </div>
                  )}

                  {isDarpanVerified && (
                    <div className="bg-green-50 border border-green-200 text-gov-success text-xs font-semibold p-3.5 rounded flex items-center gap-2">
                      <CheckCircle2 className="h-4.5 w-4.5 flex-shrink-0" />
                      NGO records verified with NITI Aayog registry successfully! Proceed to next step to check pre-fills.
                    </div>
                  )}
                </div>
              )}

              {/* STEP 2: ORG DETAILS */}
              {currentStep === 1 && (
                <div className="space-y-4 animate-fadeIn">
                  <h3 className="text-base font-bold text-gov-charcoal border-b border-gov-border pb-2">
                    Organization Profile Details
                  </h3>
                  
                  <Input
                    label="NGO Name"
                    required
                    error={errors.organizationName?.message}
                    {...formRegister('organizationName')}
                  />
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Input
                      label="Registration Number"
                      required
                      error={errors.registrationNumber?.message}
                      {...formRegister('registrationNumber')}
                    />
                    <Input
                      label="PAN Card Number"
                      required
                      placeholder="AAATV1298C"
                      error={errors.panNumber?.message}
                      {...formRegister('panNumber')}
                    />
                  </div>

                  <Input
                    label="Establishment Year"
                    required
                    placeholder="YYYY"
                    error={errors.establishmentYear?.message}
                    {...formRegister('establishmentYear')}
                  />
                </div>
              )}

              {/* STEP 3: CONTACT DETAILS */}
              {currentStep === 2 && (
                <div className="space-y-4 animate-fadeIn">
                  <h3 className="text-base font-bold text-gov-charcoal border-b border-gov-border pb-2">
                    Authorized Contact Credentials
                  </h3>

                  <Input
                    label="Authorized Representative Person"
                    required
                    error={errors.authorizedPerson?.message}
                    {...formRegister('authorizedPerson')}
                  />

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Input
                      label="Registered Mobile Number"
                      required
                      placeholder="10-digit number"
                      error={errors.mobile?.message}
                      {...formRegister('mobile')}
                    />
                    <Input
                      label="Official Email Address"
                      type="email"
                      required
                      placeholder="contact@organisation.org"
                      error={errors.email?.message}
                      {...formRegister('email')}
                    />
                  </div>
                </div>
              )}

              {/* STEP 4: ADDRESS */}
              {currentStep === 3 && (
                <div className="space-y-4 animate-fadeIn">
                  <h3 className="text-base font-bold text-gov-charcoal border-b border-gov-border pb-2">
                    Geographical Address Targets
                  </h3>

                  <Textarea
                    label="Office Address"
                    required
                    rows={3}
                    error={errors.address?.message}
                    {...formRegister('address')}
                  />

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Select
                      label="State"
                      required
                      options={STATES.filter(s => s !== 'All States').map(s => ({ value: s, label: s }))}
                      error={errors.state?.message}
                      {...formRegister('state')}
                    />
                    <Input
                      label="District"
                      required
                      error={errors.district?.message}
                      {...formRegister('district')}
                    />
                  </div>
                </div>
              )}

              {/* STEP 5: BANK DETAILS */}
              {currentStep === 4 && (
                <div className="space-y-4 animate-fadeIn">
                  <h3 className="text-base font-bold text-gov-charcoal border-b border-gov-border pb-2">
                    PFMS Registry Bank Credentials
                  </h3>

                  <Input
                    label="Bank Name"
                    required
                    error={errors.bankName?.message}
                    {...formRegister('bankName')}
                  />

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Input
                      label="Bank Account Number"
                      required
                      error={errors.bankAccountNumber?.message}
                      {...formRegister('bankAccountNumber')}
                    />
                    <Input
                      label="IFSC Code"
                      placeholder="e.g. SBIN0000213"
                      required
                      error={errors.ifscCode?.message}
                      {...formRegister('ifscCode')}
                    />
                  </div>
                </div>
              )}

              {/* STEP 6: UPLOADS */}
              {currentStep === 5 && (
                <div className="space-y-5 animate-fadeIn">
                  <h3 className="text-base font-bold text-gov-charcoal border-b border-gov-border pb-2">
                    Mandatory Registration Attachments
                  </h3>

                  {uploadError && (
                    <div className="bg-red-50 border border-red-200 text-gov-error text-xs font-semibold p-3 rounded flex items-center gap-2">
                      <Info className="h-4 w-4" /> {uploadError}
                    </div>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                    <FileUpload
                      label="NGO PAN Card (PDF)"
                      accept=".pdf"
                      required
                      onFileSelect={setUploadedPan}
                    />
                    <FileUpload
                      label="NGO Darpan Certificate (PDF)"
                      accept=".pdf"
                      required
                      onFileSelect={setUploadedDarpan}
                    />
                    <FileUpload
                      label="Registered Trust Deed (PDF)"
                      accept=".pdf"
                      required
                      onFileSelect={setUploadedTrust}
                    />
                  </div>
                </div>
              )}

              {/* STEP 7: REVIEW DETAILS */}
              {currentStep === 6 && (
                <div className="space-y-6 animate-fadeIn">
                  <h3 className="text-base font-bold text-gov-charcoal border-b border-gov-border pb-2">
                    Review Submitted Registration Details
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs md:text-sm">
                    {/* Organization details */}
                    <div className="bg-gov-bg-alt p-4 rounded-lg border border-gov-border space-y-2">
                      <span className="font-bold text-gov-navy text-xs uppercase block border-b border-gov-border/50 pb-1">
                        NGO Organization Profile
                      </span>
                      <p><span className="font-semibold text-gov-charcoal">Name:</span> {getValues('organizationName')}</p>
                      <p><span className="font-semibold text-gov-charcoal">Darpan ID:</span> {getValues('darpanId')}</p>
                      <p><span className="font-semibold text-gov-charcoal">PAN Card:</span> {getValues('panNumber')}</p>
                      <p><span className="font-semibold text-gov-charcoal">Registration No:</span> {getValues('registrationNumber')}</p>
                    </div>

                    {/* Contacts & Address details */}
                    <div className="bg-gov-bg-alt p-4 rounded-lg border border-gov-border space-y-2">
                      <span className="font-bold text-gov-navy text-xs uppercase block border-b border-gov-border/50 pb-1">
                        Contact & Address Details
                      </span>
                      <p><span className="font-semibold text-gov-charcoal">Representative:</span> {getValues('authorizedPerson')}</p>
                      <p><span className="font-semibold text-gov-charcoal">Mobile:</span> {getValues('mobile')}</p>
                      <p><span className="font-semibold text-gov-charcoal">Email:</span> {getValues('email')}</p>
                      <p><span className="font-semibold text-gov-charcoal">State/Dist:</span> {getValues('state')} / {getValues('district')}</p>
                    </div>

                    {/* Bank Details */}
                    <div className="bg-gov-bg-alt p-4 rounded-lg border border-gov-border space-y-2 md:col-span-2">
                      <span className="font-bold text-gov-navy text-xs uppercase block border-b border-gov-border/50 pb-1">
                        PFMS Registry Bank Details
                      </span>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                        <p><span className="font-semibold text-gov-charcoal">Bank:</span> {getValues('bankName')}</p>
                        <p><span className="font-semibold text-gov-charcoal">Account:</span> {getValues('bankAccountNumber')}</p>
                        <p><span className="font-semibold text-gov-charcoal">IFSC Code:</span> {getValues('ifscCode')}</p>
                      </div>
                    </div>

                    {/* Uploaded Documents details */}
                    <div className="bg-gov-bg-alt p-4 rounded-lg border border-gov-border space-y-2 md:col-span-2 select-none">
                      <span className="font-bold text-gov-navy text-xs uppercase block border-b border-gov-border/50 pb-1">
                        Mandatory Upload Attachments
                      </span>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 font-mono text-[10px] text-gov-charcoal font-semibold">
                        <p>✓ PAN: {uploadedPan?.name}</p>
                        <p>✓ DARPAN: {uploadedDarpan?.name}</p>
                        <p>✓ DEED: {uploadedTrust?.name}</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-orange-50 border border-orange-200 text-orange-800 text-[11px] p-3.5 rounded leading-normal flex items-start gap-2.5 font-semibold">
                    <Info className="h-5 w-5 text-orange-600 flex-shrink-0 mt-0.5" />
                    <span>
                      Disclaimer: By clicking submit, you verify that all uploaded tax PAN files, audit histories, and trust deeds represent valid NGO credentials. Mismatches lead to legal blacklisting.
                    </span>
                  </div>
                </div>
              )}

              {/* STAGE NAVIGATION CONTROLS */}
              <div className="flex justify-between items-center border-t border-gov-border pt-5 select-none">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handlePrevStep}
                  disabled={currentStep === 0 || isSubmitting}
                  className="gap-1 text-xs font-semibold"
                >
                  <ChevronLeft className="h-4 w-4" /> Previous Step
                </Button>

                {currentStep < steps.length - 1 ? (
                  <Button
                    type="button"
                    variant="primary"
                    size="sm"
                    onClick={handleNextStep}
                    className="gap-1 text-xs font-semibold"
                  >
                    Save & Continue <ChevronRight className="h-4 w-4" />
                  </Button>
                ) : (
                  <Button
                    type="submit"
                    variant="secondary"
                    size="sm"
                    isLoading={isSubmitting}
                    className="font-semibold shadow-md"
                  >
                    Submit Registration
                  </Button>
                )}
              </div>

            </form>
          )}

        </Card>
      </div>
    </div>
  );
};
