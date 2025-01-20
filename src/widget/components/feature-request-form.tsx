import { useState, FormEvent, ChangeEvent } from 'react';
import { toast } from 'sonner';
interface FormData {
  title: string;
  description: string;
  name: string;
  email: string;
}

interface FormErrors {
  title?: string;
  description?: string;
  name?: string;
  email?: string;
  submit?: string;
}

interface ApiErrorResponse {
  errors: {
    contributor?: {
      name?: string[];
      email?: string[];
    };
    title?: string[];
    description?: string[];
  };
}

interface FeatureRequestFormProps {
  authToken: string;
}

const FeatureRequestForm: React.FC<FeatureRequestFormProps> = ({
  authToken,
}) => {
  const [formData, setFormData] = useState<FormData>({
    title: '',
    description: '',
    name: '',
    email: '',
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validate = (): FormErrors => {
    const newErrors: FormErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }

    return newErrors;
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const validationErrors = validate();

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setIsSubmitting(true);
    setErrors({});

    try {
      //const response = await fetch('https://upvoted.io/api/boards/features', {
      const response = await fetch(
        'http://localhost:4000/api/boards/features',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${authToken}`,
          },
          body: JSON.stringify({
            title: formData.title,
            description: formData.description,
            contributor: {
              name: formData.name,
              email: formData.email,
            },
          }),
        },
      );

      const data = (await response.json()) as ApiErrorResponse;

      if (!response.ok) {
        // Handle API errors
        if (data.errors) {
          const apiErrors: FormErrors = {};

          // Handle contributor nested errors
          if (data.errors.contributor) {
            if (data.errors.contributor.name) {
              apiErrors.name = data.errors.contributor.name[0];
            }
            if (data.errors.contributor.email) {
              apiErrors.email = data.errors.contributor.email[0];
            }
          }

          // Handle direct field errors
          if (data.errors.title) {
            apiErrors.title = data.errors.title[0];
          }
          if (data.errors.description) {
            apiErrors.description = data.errors.description[0];
          }

          setErrors(apiErrors);
        }
        return;
      }

      toast.success('Feature request submitted successfully!', {
        duration: 1000,
        style: {
          background: '#1d293b',
          color: '#ffffff',
          border: '1px solid #475569',
        },
      });

      // Success - reset form
      setFormData({
        title: '',
        description: '',
        name: '',
        email: '',
      });
    } catch (error) {
      setErrors({
        submit:
          'An error occurred while submitting the form. Please try again.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <div className='max-w-2xl mx-auto p-6'>
      <form onSubmit={handleSubmit} className='space-y-6'>
        <div>
          <label
            htmlFor='title'
            className='block text-sm font-medium mb-1 text-white'
          >
            Title*
          </label>
          <input
            type='text'
            id='title'
            name='title'
            value={formData.title}
            onChange={handleChange}
            className='w-full px-3 py-2 bg-widget-input border border-widget-border
                       text-white rounded-md focus:outline-none focus:ring-2
                       focus:ring-widget-focus focus:border-widget-focus'
            disabled={isSubmitting}
          />
          {errors.title && (
            <p className='mt-1 text-sm text-red-500'>{errors.title}</p>
          )}
        </div>

        <div>
          <label
            htmlFor='description'
            className='block text-sm font-medium mb-1 text-white'
          >
            Description*
          </label>
          <textarea
            id='description'
            name='description'
            value={formData.description}
            onChange={handleChange}
            rows={4}
            className='w-full px-3 py-2 bg-widget-input border border-widget-border
                       text-white rounded-md focus:outline-none focus:ring-2
                       focus:ring-widget-focus focus:border-widget-focus'
            disabled={isSubmitting}
          />
          {errors.description && (
            <p className='mt-1 text-sm text-red-500'>{errors.description}</p>
          )}
        </div>

        <div>
          <label
            htmlFor='name'
            className='block text-sm font-medium mb-1 text-white'
          >
            Name*
          </label>
          <input
            type='text'
            id='name'
            name='name'
            value={formData.name}
            onChange={handleChange}
            className='w-full px-3 py-2 bg-widget-input border border-widget-border
                       text-white rounded-md focus:outline-none focus:ring-2
                       focus:ring-widget-focus focus:border-widget-focus'
            disabled={isSubmitting}
          />
          {errors.name && (
            <p className='mt-1 text-sm text-red-500'>{errors.name}</p>
          )}
        </div>

        <div>
          <label
            htmlFor='email'
            className='block text-sm font-medium mb-1 text-white'
          >
            Email*
          </label>
          <input
            type='email'
            id='email'
            name='email'
            value={formData.email}
            onChange={handleChange}
            className='w-full px-3 py-2 bg-widget-input border border-widget-border
                       text-white rounded-md focus:outline-none focus:ring-2
                       focus:ring-widget-focus focus:border-widget-focus'
            disabled={isSubmitting}
          />
          {errors.email && (
            <p className='mt-1 text-sm text-red-500'>{errors.email}</p>
          )}
        </div>

        {errors.submit && (
          <p className='text-sm text-red-500'>{errors.submit}</p>
        )}

        <button
          type='submit'
          disabled={isSubmitting}
          className='w-full bg-widget-focus text-white py-2 px-4 rounded-md
                     hover:bg-opacity-90 focus:outline-none focus:ring-2
                     focus:ring-widget-focus focus:ring-offset-2
                     focus:ring-offset-widget-bg disabled:opacity-50'
        >
          {isSubmitting ? 'Submitting...' : 'Submit Feature Request'}
        </button>
      </form>
    </div>
  );
};

export default FeatureRequestForm;
