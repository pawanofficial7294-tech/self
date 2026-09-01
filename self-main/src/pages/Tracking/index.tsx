import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Breadcrumb, SectionHeader, LoadingSpinner, ErrorState } from '../../components/common/States';
import { Timeline } from '../../components/common/Timeline';
import { Card, CardHeader } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/FormComponents';
import { applicationService } from '../../services/applicationService';
import { type ApplicationStatus } from '../../constants/mockData';
import { Search, Calendar, FileText } from 'lucide-react';

export const Tracking: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [applicationData, setApplicationData] = useState<ApplicationStatus | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchTrackingDetails = async (id: string) => {
    setIsLoading(true);
    setError(null);
    setApplicationData(null);
    try {
      const data = await applicationService.trackApplication(id);
      setApplicationData(data);
    } catch (err: any) {
      setError(err.message || 'Unable to locate application records.');
    } finally {
      setIsLoading(false);
    }
  };

  // Run on mount if query param exists
  useEffect(() => {
    const id = searchParams.get('id');
    if (id) {
      setSearchQuery(id);
      fetchTrackingDetails(id);
    }
  }, [searchParams]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setSearchParams({ id: searchQuery.trim() });
    }
  };

  return (
    <div className="bg-gov-bg-alt min-h-screen pb-12">
      <Breadcrumb items={[{ label: 'Tracking' }]} />

      <div className="max-w-4xl mx-auto px-4 py-10 space-y-8">
        <SectionHeader
          title="Proposal Status Tracking"
          subtitle="Check the real-time screening reviews, Collector comments, and PFMS token release milestones for your grant proposal."
          badge="Track Application"
        />

        {/* Search Bar Panel */}
        <Card className="bg-white border border-gov-border shadow-sm p-6">
          <form onSubmit={handleSearchSubmit} className="flex flex-col sm:flex-row gap-3 items-end">
            <div className="flex-1 w-full">
              <Input
                label="Application Reference Number"
                placeholder="e.g. NGO-2026-00124"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                required
                helperText="Enter the unique reference code issued during project submission."
              />
            </div>
            <Button
              type="submit"
              variant="primary"
              className="w-full sm:w-auto font-semibold gap-1.5 py-2.5 flex-shrink-0"
            >
              <Search className="h-4 w-4" /> Track Status
            </Button>
          </form>
        </Card>

        {/* Loaders, Errors & Tracking Timelines */}
        {isLoading && (
          <Card className="bg-white p-8 border border-gov-border">
            <LoadingSpinner message="Searching central database records..." />
          </Card>
        )}

        {error && (
          <Card className="bg-white p-6 border border-gov-border">
            <ErrorState
              title="Application Not Found"
              message={error}
              onRetry={() => searchQuery && fetchTrackingDetails(searchQuery)}
            />
          </Card>
        )}

        {applicationData && (
          <div className="space-y-6 animate-fadeIn">
            {/* Metadata Card */}
            <Card className="bg-white border border-gov-border p-6 shadow-sm">
              <CardHeader className="flex justify-between items-start gap-4 flex-wrap border-b border-gov-border/50 pb-4">
                <div>
                  <span className="text-[10px] font-bold text-gov-muted uppercase">Proposal Reference</span>
                  <h3 className="text-lg font-extrabold text-gov-navy mt-0.5">{applicationData.applicationId}</h3>
                </div>
                
                <div className="text-right sm:text-left select-none">
                  <span className="text-[10px] font-bold text-gov-muted uppercase block">Current Stage</span>
                  <span className={`inline-block text-xs font-bold px-3 py-1 rounded-full border mt-1 ${
                    applicationData.status === 'Sanctioned' || applicationData.status === 'Approved'
                      ? 'bg-green-50 text-gov-success border-green-200'
                      : applicationData.status === 'Rejected'
                      ? 'bg-red-50 text-gov-error border-red-200'
                      : 'bg-blue-50 text-gov-navy border-blue-200 animate-pulse'
                  }`}>
                    {applicationData.status}
                  </span>
                </div>
              </CardHeader>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 text-xs md:text-sm">
                <div className="space-y-2">
                  <div className="flex gap-2 text-gov-muted leading-normal">
                    <FileText className="h-4 w-4 text-gov-muted flex-shrink-0 mt-0.5" />
                    <div>
                      <span className="font-semibold text-gov-charcoal block">Organisation Name:</span>
                      {applicationData.ngoName}
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex gap-2 text-gov-muted leading-normal">
                    <Calendar className="h-4 w-4 text-gov-muted flex-shrink-0 mt-0.5" />
                    <div>
                      <span className="font-semibold text-gov-charcoal block">Last Status Update:</span>
                      {applicationData.updatedAt}
                    </div>
                  </div>
                </div>

                <div className="col-span-1 md:col-span-2 pt-2 border-t border-gov-border/50">
                  <div className="flex gap-2 text-gov-muted leading-normal">
                    <span className="font-semibold text-gov-charcoal block">Scheme Requested:</span>
                    {applicationData.schemeName}
                  </div>
                </div>
              </div>
            </Card>

            {/* Visual Timeline Card */}
            <Card className="bg-white border border-gov-border p-6 md:p-8 shadow-sm">
              <h4 className="text-sm font-bold text-gov-charcoal border-b border-gov-border pb-3 mb-6">
                Proposal Processing Pipeline
              </h4>
              <Timeline steps={applicationData.steps} layout="vertical" />
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};
