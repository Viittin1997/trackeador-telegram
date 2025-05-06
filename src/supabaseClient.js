// Este arquivo está obsoleto e não deve ser usado
// Todas as operações de banco de dados devem ser feitas através da API
// Mantendo este arquivo apenas para compatibilidade com código existente

export const supabase = {
  // Métodos vazios para compatibilidade
  auth: {
    signIn: () => console.warn('Método Supabase obsoleto: use a API em vez disso'),
    signOut: () => console.warn('Método Supabase obsoleto: use a API em vez disso')
  },
  from: () => ({
    select: () => ({
      eq: () => ({
        then: () => console.warn('Método Supabase obsoleto: use a API em vez disso')
      })
    })
  })
};
