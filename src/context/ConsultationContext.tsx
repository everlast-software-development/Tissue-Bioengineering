import React, { createContext, useContext, useState } from 'react';
import { ServiceCategory } from '@/types';

export interface ConsultationState {
  step: number;
  fullName: string;
  email: string;
  phone: string;
  age: number | '';
  serviceCategory: ServiceCategory;
  medicalHistory: string;
  preferredDate: string;
  preferredTime: string;
}

interface ConsultationContextType {
  state: ConsultationState;
  setField: (field: keyof ConsultationState, value: unknown) => void;
  nextStep: () => void;
  prevStep: () => void;
  resetForm: () => void;
}

const initialState: ConsultationState = {
  step: 1,
  fullName: '',
  email: '',
  phone: '',
  age: '',
  serviceCategory: 'Burn Scar Treatment',
  medicalHistory: '',
  preferredDate: '',
  preferredTime: '10:00 AM',
};

const ConsultationContext = createContext<ConsultationContextType | undefined>(undefined);

export const ConsultationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<ConsultationState>(initialState);

  const setField = (field: keyof ConsultationState, value: unknown) => {
    setState((prev) => ({ ...prev, [field]: value }));
  };

  const nextStep = () => setState((prev) => ({ ...prev, step: prev.step + 1 }));
  const prevStep = () => setState((prev) => ({ ...prev, step: Math.max(1, prev.step - 1) }));
  const resetForm = () => setState(initialState);

  return (
    <ConsultationContext.Provider value={{ state, setField, nextStep, prevStep, resetForm }}>
      {children}
    </ConsultationContext.Provider>
  );
};

export const useConsultation = () => {
  const context = useContext(ConsultationContext);
  if (!context) {
    throw new Error('useConsultation must be used within a ConsultationProvider');
  }
  return context;
};
