import { useState, FormEvent, ChangeEvent, useEffect } from 'react';
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

  const [showSuccess, setShowSuccess] = useState(false);

  // Reset form after success message
  useEffect(() => {
    if (showSuccess) {
      const timer = setTimeout(() => {
        setShowSuccess(false);
        setFormData({
          title: '',
          description: '',
          name: '',
          email: '',
        });
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [showSuccess]);

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
      //const upvotedEndpoint = 'http://localhost:4000/api/boards/features';
      const upvotedEndpoint = 'https://upvoted.io/api/boards/features';
      const response = await fetch(upvotedEndpoint, {
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
      });

      const data = (await response.json()) as ApiErrorResponse;

      if (!response.ok) {
        if (data.errors) {
          const apiErrors: FormErrors = {};

          if (data.errors.contributor) {
            if (data.errors.contributor.name) {
              apiErrors.name = data.errors.contributor.name[0];
            }
            if (data.errors.contributor.email) {
              apiErrors.email = data.errors.contributor.email[0];
            }
          }

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

      // Show success message
      setShowSuccess(true);
    } catch (error) {
      console.log(error);
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
            className='block text-sm font-medium mb-1 text-slate-700 dark:text-white'
          >
            Title*
          </label>
          <input
            type='text'
            id='title'
            name='title'
            value={formData.title}
            onChange={handleChange}
            className='w-full px-3 py-2 bg-widget-input-light dark:bg-widget-input-dark border-1
                       rounded-md focus:outline-none focus:ring-2
                       focus:ring-widget-focus focus:border-widget-focus text-slate-700 dark:text-white'
            disabled={isSubmitting}
          />
          {errors.title && (
            <p className='mt-1 text-sm text-red-500'>{errors.title}</p>
          )}
        </div>

        <div>
          <label
            htmlFor='description'
            className='block text-sm font-medium mb-1 text-slate-700 dark:text-white'
          >
            Description*
          </label>
          <textarea
            id='description'
            name='description'
            value={formData.description}
            onChange={handleChange}
            rows={4}
            className='w-full px-3 py-2 bg-widget-input-light dark:bg-widget-input-dark border-1
                       text-slate-700 dark:text-white rounded-md focus:outline-none focus:ring-2
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
            className='block text-sm font-medium mb-1 text-slate-700 dark:text-white'
          >
            Name*
          </label>
          <input
            type='text'
            id='name'
            name='name'
            value={formData.name}
            onChange={handleChange}
            className='w-full px-3 py-2 bg-widget-input-light dark:bg-widget-input-dark border-1
                       text-slate-700 dark:text-white rounded-md focus:outline-none focus:ring-2
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
            className='block text-sm font-medium mb-1 text-slate-700 dark:text-white'
          >
            Email*
          </label>
          <input
            type='email'
            id='email'
            name='email'
            value={formData.email}
            onChange={handleChange}
            className='w-full px-3 py-2 bg-widget-input-light dark:bg-widget-input-dark border-1
                       text-slate-700 dark:text-white rounded-md focus:outline-none focus:ring-2
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

        {showSuccess ? (
          <div className='flex items-center justify-center p-4 bg-green-500 bg-opacity-20 border-1 border-green-500 rounded-md'>
            <p className='text-green-400 font-medium'>
              Feature request submitted successfully! ✨
            </p>
          </div>
        ) : (
          <button
            type='submit'
            disabled={isSubmitting}
            className='w-full bg-widget-focus text-white dark:text-white py-2 px-4 rounded-md
                             hover:bg-opacity-90 focus:outline-none focus:ring-2
                             focus:ring-widget-focus focus:ring-offset-2
                             focus:ring-offset-widget-bg disabled:opacity-50 text-md'
          >
            {isSubmitting ? 'Submitting...' : 'Submit Feature Request'}
          </button>
        )}
        <p className='text-xs text-slate-700 dark:text-white float-right'>
          <a href='https://upvoted.io' target='_blank'>
            Powered by Upvoted
          </a>
        </p>
      </form>
    </div>
  );
};

export default FeatureRequestForm;
