import { supabase } from '../lib/supabase';
import { Property, ConstructionLog } from '../types';
import { PROPERTIES, CONSTRUCTION_LOGS } from '../data';

export const propertyService = {
  async getProperties(): Promise<Property[]> {
    try {
      const { data, error } = await supabase
        .from('properties')
        .select('*')
        .order('id', { ascending: true });

      if (error) throw error;
      
      // If no data in Supabase yet, return static data as fallback
      if (!data || data.length === 0) {
        console.info('No properties found in Supabase, using local fallback.');
        return PROPERTIES;
      }

      return data as Property[];
    } catch (error) {
      console.error('Error fetching properties from Supabase:', error);
      return PROPERTIES;
    }
  },

  async getPropertyById(id: string): Promise<Property | null> {
    try {
      const { data, error } = await supabase
        .from('properties')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      return data as Property;
    } catch (error) {
      console.error(`Error fetching property ${id} from Supabase:`, error);
      return PROPERTIES.find(p => p.id === id) || null;
    }
  },

  async getConstructionLogs(projectId: string): Promise<ConstructionLog[]> {
    try {
      const { data, error } = await supabase
        .from('construction_logs')
        .select('*')
        .eq('projectId', projectId)
        .order('date', { ascending: false });

      if (error) throw error;

      if (!data || data.length === 0) {
        return CONSTRUCTION_LOGS.filter(log => log.projectId === projectId);
      }

      return data as ConstructionLog[];
    } catch (error) {
      console.error(`Error fetching construction logs for ${projectId}:`, error);
      return CONSTRUCTION_LOGS.filter(log => log.projectId === projectId);
    }
  }
};
