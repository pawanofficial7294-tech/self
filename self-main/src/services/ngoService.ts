
export interface NGORegistrationPayload {
  organizationName: string;
  panNumber: string;
  registrationNumber: string;
  darpanId: string;
  establishmentYear: string;
  mobile: string;
  email: string;
  address: string;
  state: string;
  district: string;
  bankName: string;
  bankAccountNumber: string;
  ifscCode: string;
  documents: {
    panCard: string;
    darpanCertificate: string;
    trustDeed: string;
  };
}

export const ngoService = {
  // Verify NGO Darpan ID and pre-fill NITI Aayog details
  verifyDarpanId: async (darpanId: string): Promise<any> => {
    // In production:
    // const response = await api.get(`/ngo/verify-darpan/${darpanId}`);
    // return response.data;
    
    await new Promise((resolve) => setTimeout(resolve, 800));
    
    if (!darpanId.match(/^[A-Z]{2}\/\d{4}\/\d{7}$/) && !darpanId.includes('JH/2026/014920') && !darpanId.includes('JH/2026/08849')) {
      throw new Error('Invalid NGO Darpan ID format. Example format: JH/2026/1234567');
    }

    // Return prefilled mock data matching NITI Aayog database
    return {
      darpanId,
      organizationName: 'Vikas Kalyan Sansthan',
      registrationNumber: 'SOCIETY-JH-99238',
      establishmentYear: '2015',
      panNumber: 'AAATV1298C',
      state: 'Jharkhand',
      district: 'Ranchi',
      email: 'contact@vikaskalyan.org',
      mobile: '9876543210',
    };
  },

  // Submit multi-step NGO Registration Wizard
  registerNGO: async (payload: NGORegistrationPayload): Promise<{ success: boolean; registrationId: string }> => {
    // In production:
    // const response = await api.post('/ngo/register', payload);
    // return response.data;
    
    await new Promise((resolve) => setTimeout(resolve, 1500));
    
    if (!payload.organizationName || !payload.darpanId || !payload.bankAccountNumber) {
      throw new Error('Required organization, NITI Aayog, or bank details are missing.');
    }
    
    const randomId = `REG-${Math.floor(100000 + Math.random() * 900000)}`;
    return {
      success: true,
      registrationId: randomId
    };
  },

  // Fetch NGO Profile for the dashboard
  fetchNGOProfile: async (ngoId: string): Promise<any> => {
    // In production:
    // const response = await api.get(`/ngo/profile/${ngoId}`);
    // return response.data;
    
    await new Promise((resolve) => setTimeout(resolve, 500));
    return {
      id: ngoId,
      organizationName: 'Vikas Kalyan Sansthan',
      darpanId: 'JH/2026/014920',
      panNumber: 'AAATV1298C',
      registrationNumber: 'SOCIETY-JH-99238',
      establishmentYear: '2015',
      email: 'contact@vikaskalyan.org',
      mobile: '9876543210',
      address: '104, Circular Road, Lalpur',
      state: 'Jharkhand',
      district: 'Ranchi',
      bankName: 'State Bank of India',
      bankAccountNumber: '38290129033',
      ifscCode: 'SBIN0000213',
    };
  }
};
