'use client';

import { useForm, Controller } from 'react-hook-form';
import { useMutation } from '@apollo/client';
// Corrected import path, assuming lib is directly under src
import { ADD_EVENT, UPDATE_EVENT, GET_UPCOMING_EVENTS, GET_EVENT_BY_ID } from '@/app/lib/graphql'; 
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

// Type for data coming FROM the database (dates are strings)
interface EventData {
  _id: string;
  title: string;
  description: string;
  startTime: string; 
  endTime: string;
  location: string;
  isRecurring?: boolean;
  recurrenceRule?: string;
}

// Type for the form itself (dates are Date objects for the picker)
interface EventFormData {
  title: string;
  description:string;
  startTime: Date;
  endTime: Date;
  location: string;
  isRecurring?: boolean;
  recurrenceRule?: string;
}

interface EventFormProps {
  initialData?: EventData;
  onCompleted: (id?: string) => void;
}

const EventForm = ({ initialData, onCompleted }: EventFormProps) => {
  const isEditMode = !!initialData;

  const { register, handleSubmit, control, watch, formState: { errors } } = useForm<EventFormData>({
    defaultValues: {
      title: initialData?.title || '',
      description: initialData?.description || '',
      location: initialData?.location || '',
      isRecurring: initialData?.isRecurring || false,
      recurrenceRule: initialData?.recurrenceRule || '',
      startTime: initialData ? new Date(initialData.startTime) : new Date(),
      endTime: initialData ? new Date(initialData.endTime) : new Date(),
    },
  });

  const [addEvent, { loading: addLoading }] = useMutation(ADD_EVENT, {
    refetchQueries: [{ query: GET_UPCOMING_EVENTS }],
    onCompleted: (data) => {
      if (data?.addEvent?._id) {
        onCompleted(data.addEvent._id);
      }
    },
     onError: (err) => alert(`Failed to add event: ${err.message}`)
  });

  const [updateEvent, { loading: updateLoading }] = useMutation(UPDATE_EVENT, {
    refetchQueries: initialData ? [{ query: GET_EVENT_BY_ID, variables: { id: initialData._id } }] : [],
    onCompleted: () => {
      onCompleted();
    },
    onError: (err) => alert(`Failed to update event: ${err.message}`)
  });

  const onSubmit = (data: EventFormData) => {
    const { isRecurring, recurrenceRule, ...rest } = data;
    const input = {
        ...rest,
        isRecurring: isRecurring || false,
        recurrenceRule: isRecurring ? recurrenceRule : null,
    };
    
    if (isEditMode) {
      if (!initialData) {
        console.error("Update failed: initialData is missing in edit mode.");
        return; 
      }
      
      // FIX #1: Correctly build the changedFields object with proper type checking.
      const changedFields: Partial<EventFormData> = {};
      Object.keys(input).forEach(keyStr => {
        const key = keyStr as keyof typeof input;
        
        let initialValue: any;
        let currentValue: any;

        if (key === 'startTime' || key === 'endTime') {
          // Compare dates by their ISO string representation
          initialValue = new Date(initialData[key]).toISOString();
          currentValue = input[key].toISOString();
        } else {
          // Compare other properties directly
          initialValue = initialData[key as keyof EventData]; // Get value from initialData
          currentValue = input[key];
        }
        
        // Ensure we don't compare undefined initial values
        if (initialValue !== undefined && initialValue !== currentValue) {
            (changedFields as any)[key] = input[key];
        }
      });
      
      if(Object.keys(changedFields).length > 0){
        updateEvent({ variables: { id: initialData._id, input: changedFields } });
      } else {
        onCompleted(); // No changes, just close the form
      }
    } else {
      addEvent({ variables: { input } });
    }
  };

  const isRecurring = watch('isRecurring');
  const loading = addLoading || updateLoading;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 max-w-2xl mx-auto bg-white p-8 rounded-lg shadow-md">
      {/* --- NO CHANGES TO THESE FIELDS --- */}
      <div>
        <label htmlFor="title" className="block text-sm font-medium text-gray-700">Title</label>
        <input {...register('title', { required: 'Title is required' })} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500" />
        {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>}
      </div>
      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
        <textarea {...register('description', { required: 'Description is required' })} rows={4} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500" />
        {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description.message}</p>}
      </div>
      
       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
            <label className="block text-sm font-medium text-gray-700">Start Time</label>
            {/* FIX #2: Remove {...field} destructuring to avoid passing conflicting props */}
            <Controller name="startTime" control={control} rules={{ required: 'Start time is required' }} render={({ field }) => (
                <DatePicker 
                    selected={field.value} 
                    onChange={(date: Date | null) => { if(date) field.onChange(date) }}
                    onBlur={field.onBlur}
                    ref={field.ref}
                    showTimeSelect 
                    dateFormat="Pp" 
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                />
            )} />
            {errors.startTime && <p className="text-red-500 text-sm mt-1">{errors.startTime.message}</p>}
        </div>
        <div>
            <label className="block text-sm font-medium text-gray-700">End Time</label>
            <Controller name="endTime" control={control} rules={{ 
                required: 'End time is required',
                validate: value => value > watch('startTime') || 'End time must be after start time'
            }} render={({ field }) => (
                <DatePicker
                    selected={field.value}
                    onChange={(date: Date | null) => { if(date) field.onChange(date) }}
                    onBlur={field.onBlur}
                    ref={field.ref}
                    showTimeSelect
                    dateFormat="Pp"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                />
            )} />
             {errors.endTime && <p className="text-red-500 text-sm mt-1">{errors.endTime.message}</p>}
        </div>
      </div>

      {/* --- NO CHANGES TO THE REST OF THE FORM --- */}
      <div>
        <label htmlFor="location" className="block text-sm font-medium text-gray-700">Location</label>
        <input {...register('location', { required: 'Location is required' })} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"/>
        {errors.location && <p className="text-red-500 text-sm mt-1">{errors.location.message}</p>}
      </div>
      <div className="flex items-start">
        <div className="flex items-center h-5">
            <input {...register('isRecurring')} type="checkbox" className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded" />
        </div>
        <div className="ml-3 text-sm">
            <label htmlFor="isRecurring" className="font-medium text-gray-700">Is this a recurring event?</label>
        </div>
      </div>
      {isRecurring && (
        <div>
          <label htmlFor="recurrenceRule" className="block text-sm font-medium text-gray-700">Recurrence Rule</label>
          <select {...register('recurrenceRule', { required: isRecurring ? 'Rule is required for recurring events' : false })} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm">
            <option value="">Select a rule</option>
            <option value="daily">Daily</option>
            <option value="weekly">Weekly</option>
            <option value="monthly">Monthly</option>
          </select>
          {errors.recurrenceRule && <p className="text-red-500 text-sm mt-1">{errors.recurrenceRule.message}</p>}
        </div>
      )}
      <div className="flex justify-end gap-4">
        <button type="button" onClick={() => onCompleted()} className="py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">Cancel</button>
        <button type="submit" disabled={loading} className="py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-300">
          {loading ? 'Saving...' : (isEditMode ? 'Update Event' : 'Add Event')}
        </button>
      </div>
    </form>
  );
};

export default EventForm;