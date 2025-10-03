import { LegacyOrder, LegacyOrderItem, Dish } from "../types/models";

export const mockDishes: Dish[] = [
    {
      id: '1',
      name: 'Salmão Grelhado',
      description: 'Salmão fresco grelhado com legumes da estação.',
      price: 55.00,
      category: 'MAIN_COURSE',
      active: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA3x1YQ_js0c4f4jPUMZlzeuUqWh7hI6P40MKGDtdgjUxiFiRyaYG1QE9aGypAIGmNHjFytdHo5y4TwRI-CZIXG9v8JG71utvDZYiNzt-3zYaz2rLfqRfD7XqPXcwqWW5bG8-_6Pil43c6ybgDSehfe8U3pgP6E5Afi4X-BhqO-goJC2oE6KcSK4ZHJrQWE4zftZvh4MuwEt0HHx-lpysQeohbdJHkRO6JiuPiFe9TGLEtPwblNCQHRTtdvpYFc6aPrNoFjErL1daI',
    },
    {
      id: '2',
      name: 'Risoto de Cogumelos',
      description: 'Risoto cremoso com uma variedade de cogumelos frescos.',
      price: 48.00,
      category: 'MAIN_COURSE',
      active: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC93HzfijxDjiYUsJRpOG26bXXzF4ztxsG1ldVSzUFiAlrley_TzJG2zuZMUaHCdND6m1T9pD7uxcnqCWdGChK-NYz_mwpxvs0qJmIgExElO9Q_ZvjxIdXoSaq_Qb0SJ_JSOMYqqMXXNkoNGdO54aA-8XmVPOBRhg0xmFWm6nV9oldTLY32euPQPFXrfndBJFwbBbfuWNxl054vm8eUF_FqkHbPMnvSnpgItHpouy5qkF9QCxV88cIRRzmCXegFBKhqCYDYMzYHvlk',
    },
    {
      id: '3',
      name: 'Tiramisu',
      description: 'Sobremesa italiana clássica com camadas de biscoitos.',
      price: 25.00,
      category: 'DESSERT',
      active: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC8UvW_jw9_XkYWCzKYmq4G4oXE5at1fPZQk9KvZEoDczfYtzmlJ3WcnA9OiMcO6Aq3dMWL4A5GumOCyVnVKo9kmoyNucVYejqmkWE4bD9HR_1XlGd-VzxFJipy6LBb0EYI3zlWhWOztqWrIKCuCH_ZoCcw3E-WyAnX06RNEvF9AAsjpDfNY6-1ltBsdnjjw-_-JkSAvFFTk59BCQhLzfPsJfa8bTFAT_Y3pYqp-kbik5yfbuk3UpPyZ-o69Rmbafh_QhG3APzxwEc',
    },
    {
      id: '4',
      name: 'Vinho Tinto',
      description: 'Uma garrafa de vinho tinto para acompanhar sua refeição.',
      price: 75.00,
      category: 'DRINK',
      active: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCVquBEtnB-Ujo9yvtFguHkW-POvPYFYOhhgb4qOQ8crM78ai8h4EJoZqWVbVpFwVSpe4Bycsxrb-tDZk8b4UlGbeK4PL3A5fmrd6pyUz-Az7XSRXKmWAkyKOYlEfk1EuEIvLOklHRXJkTP7u4NKz9yM6c_J2Be5098d1nheLK3t05DsCmdeJNap4PP459p9HLzhy2-Ocm7V5ztaaOOQBKmgoUoMMDV8nEndVWoXIVsXHkvFfUAXJhheT1R77N8EEwynpwqTVyyGJ4',
    }
  ];

export const mockOrderItems: LegacyOrderItem[] = [
    {
      id: 1,
      name: 'Salada de Frutas',
      price: 12.00,
      quantity: 1,
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDVuEivmA96e7CVgv4QrCuexOMYhiaJj2oGZjQaajoxe3ddh8lTxt0DtEe5WuMYhmsbxIChIihmKOHJ7Qo6j14w1gv5CEq-TOsqSYTOIEFSk4JNl434u3op1A9xbN7CsFAGqrUh1staOukgRxsmuO4dQRWDUdJ2wEO8Vkcg6vzXl3_2lXWwk5Dg3wQC_5lBfb_qtT5Vd33hIz2UcDlJfI05WAzFDyFLyGUTGkqFc-WyKZLKVcRuvmOIf-X4spCdUFYfYW02YiG8bOc'
    },
    {
      id: 2,
      name: 'Suco de Laranja',
      price: 15.00,
      quantity: 1,
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDE3DsIIVbJAo6hHTd-iUSrTTcHLWhBygOtBLBhE6s-tz3IQnsGOnSkx2F-AUTu74h5lJm73yXIaNKRDj9wAY7B7GepV119kiCIj22fV1VkyL9GOGVohB7idJXqW3amXDDwETbcMeDHBn0cOznVXDurLeFoqmLhijQpXS3dLNjFszkshh4-xa71Ib39QtSV3bDR45a9FvQofk0NmPHGzaN7OSNGQSlTehXVwdgBmRxNSa2EIdD2zVMWpI6zpRIwMv62fbUoHx05P6o'
    },
    {
      id: 3,
      name: 'Sanduíche Natural',
      price: 20.00,
      quantity: 1,
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDofMpFI-sOHtg_lotKKbftydLIgtRUmjgnyM-v8ZgVHAEnUU8VfXTaYzRl9Jkbbl14D32D2r2cbyNtYsqjlHwpBx9X88XUPUPOkSzQ3aytFJHYq_LWVDNPU6FjgZr04X3XAZZ3Ot-XHWD5_Qs7JM_AcahnlGlEluUiCbEZqy4SxxsWZbHTj8rBES8WDFDfbMCnYTrpRO0llMmBoQRJCVieDZKwrd5AcUUBDSBDU5zTLM5Bh96DwiuVh2a1wi2KZAJ9uypIdFUcBRw'
    },
  ];

  export const mockOrders: LegacyOrder[] = [
    {
      id: 1,
      orderNumber: '#12345',
      date: '2024-01-15',
      time: '14:30',
      items: 'Hambúrguer Artesanal, Batata Frita',
      total: 45.90,
      status: 'PREPARING'
    },
    {
      id: 2,
      orderNumber: '#12346',
      date: '2024-01-15',
      time: '14:45',
      items: 'Pizza Margherita, Refrigerante',
      total: 32.50,
      status: 'READY'
    },
    {
      id: 3,
      orderNumber: '#12347',
      date: '2024-01-15',
      time: '15:00',
      items: 'Salada Caesar, Suco Natural',
      total: 28.00,
      status: 'DELIVERED'
    }
  ];