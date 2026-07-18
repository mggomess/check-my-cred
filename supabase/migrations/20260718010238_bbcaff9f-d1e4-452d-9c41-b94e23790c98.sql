
CREATE TABLE public.certificados (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  codigo text NOT NULL UNIQUE,
  nome text NOT NULL,
  cpf text NOT NULL,
  data_nascimento date NOT NULL,
  curso text NOT NULL,
  nivel text NOT NULL,
  ano_conclusao integer NOT NULL,
  instituicao text NOT NULL,
  estado text NOT NULL,
  cidade text NOT NULL,
  endereco text NOT NULL,
  registro text NOT NULL,
  data_emissao date NOT NULL,
  ativo boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT ON public.certificados TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.certificados TO authenticated;
GRANT ALL ON public.certificados TO service_role;

ALTER TABLE public.certificados ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Consulta pública de certificados"
  ON public.certificados FOR SELECT
  USING (true);

INSERT INTO public.certificados (codigo, nome, cpf, data_nascimento, curso, nivel, ano_conclusao, instituicao, estado, cidade, endereco, registro, data_emissao, ativo)
VALUES
  ('CERT-2024-0001', 'João da Silva Souza', '123.456.789-00', '1995-04-12', 'Técnico em Administração', 'Ensino Técnico', 2024, 'Instituto Federal de Educação', 'SP', 'São Paulo', 'Av. Paulista, 1000 - Bela Vista', 'REG-2024/00123', '2024-12-15', true),
  ('CERT-2023-0099', 'Maria Oliveira Santos', '987.654.321-00', '1990-09-25', 'Pedagogia', 'Ensino Superior', 2023, 'Universidade Federal do Brasil', 'MG', 'Belo Horizonte', 'Rua das Flores, 250 - Centro', 'REG-2023/00099', '2023-07-20', false);
