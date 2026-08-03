// Cliente somente-leitura para o banco do sistema emissor (emblem-beam).
// Usa a chave publicável (anon) — as tabelas consultadas são públicas.
import { createClient } from "@supabase/supabase-js";

const EMISSOR_URL = "https://imblvqejapqjfjpkgypc.supabase.co";
const EMISSOR_PUBLISHABLE_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImltYmx2cWVqYXBxamZqcGtneXBjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODM1MTQ5NjYsImV4cCI6MjA5OTA5MDk2Nn0.LxveuRyEDRP7Aa2527QkEfbHovyqflAbpeE72iVTCWs";

export function createEmissorClient() {
  return createClient(EMISSOR_URL, EMISSOR_PUBLISHABLE_KEY, {
    auth: {
      storage: undefined,
      persistSession: false,
      autoRefreshToken: false,
    },
    global: {
      fetch: (input, init) => {
        const headers = new Headers(init?.headers);
        headers.delete("Authorization");
        headers.set("apikey", EMISSOR_PUBLISHABLE_KEY);
        return fetch(input, { ...init, headers });
      },
    },
  });
}

export type CertificadoPublico = {
  codigo: string;
  nome: string;
  cpf: string;
  data_nascimento: string;
  curso: string;
  nivel: string;
  ano_conclusao: number;
  instituicao: string;
  estado: string;
  cidade: string;
  endereco: string;
  registro: string;
  data_emissao: string;
  ativo: boolean;
};

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

const EMISSOR_API = "https://emblem-beam.lovable.app/api/public/certificados";

/** Consulta o endpoint público do sistema emissor (emblem-beam). */
export async function buscarNoEndpointPublico(
  uuid: string,
): Promise<CertificadoPublico | null> {
  const res = await fetch(`${EMISSOR_API}/${encodeURIComponent(uuid)}`, {
    headers: { accept: "application/json" },
  });

  if (res.status === 404) return null;
  if (!res.ok) throw new Error(`Endpoint público respondeu ${res.status}`);

  const contentType = res.headers.get("content-type") ?? "";
  if (!contentType.includes("application/json")) {
    throw new Error("Endpoint público não retornou JSON");
  }

  const payload = (await res.json()) as {
    found?: boolean;
    certificado?: Record<string, any>;
  };

  if (!payload?.found || !payload.certificado) return null;

  const c = payload.certificado;
  const status = String(c.status ?? "").toLowerCase();

  return {
    codigo: c.codigo ?? uuid,
    nome: c.nome ?? "",
    cpf: c.cpf ?? "",
    data_nascimento: c.data_nascimento ?? "",
    curso: c.curso ?? "",
    nivel: c.nivel ?? "Certificado",
    ano_conclusao: anoDe(c.ano_conclusao, c.data_emissao),
    instituicao: c.instituicao ?? "",
    estado: c.estado ?? "",
    cidade: c.cidade ?? "",
    endereco: c.endereco ?? "",
    registro: c.registro ?? c.codigo ?? uuid,
    data_emissao: String(c.data_emissao ?? "").slice(0, 10),
    ativo: status ? status !== "cancelado" && status !== "inativo" : true,
  };
}

function anoDe(valor: unknown, fallbackIso?: string | null): number {
  const n = Number(valor);
  if (Number.isFinite(n) && n > 1900) return n;
  if (fallbackIso) {
    const y = new Date(fallbackIso).getFullYear();
    if (Number.isFinite(y)) return y;
  }
  return 0;
}

/** Consulta o banco do emissor: históricos (UUID do QR), registros e certificados. */
export async function buscarNoEmissor(codigo: string): Promise<CertificadoPublico | null> {
  const supabase = createEmissorClient();

  // 1) Histórico / diploma verificado por UUID (QR Code).
  if (UUID_RE.test(codigo)) {
    const { data } = await supabase
      .from("historicos")
      .select("*")
      .eq("verification_uuid", codigo)
      .maybeSingle();

    if (data) {
      const h = data as Record<string, any>;
      return {
        codigo: h.verification_uuid,
        nome: h.nome_aluno ?? "",
        cpf: h.cpf ?? "",
        data_nascimento: h.data_nascimento ?? "",
        curso: h.curso ?? "",
        nivel: h.nivel_label ?? h.nivel ?? "Ensino Superior",
        ano_conclusao: anoDe(h.ano_conclusao, h.data_conclusao ?? h.issued_at),
        instituicao: h.instituicao ?? h.universidade ?? "",
        estado: h.estado ?? "",
        cidade: h.cidade ?? "",
        endereco: h.endereco ?? "",
        registro: h.numero_registro ?? h.verification_uuid,
        data_emissao: (h.issued_at ?? "").slice(0, 10),
        ativo: h.status ? h.status !== "cancelado" : true,
      };
    }
  }

  // 2) Registros de certificados emitidos.
  const { data: registro } = await supabase
    .from("certificados_registros")
    .select("*")
    .eq("codigo", codigo)
    .maybeSingle();

  if (registro) {
    const r = registro as Record<string, any>;
    return {
      codigo: r.codigo,
      nome: r.nome ?? "",
      cpf: r.cpf ?? "",
      data_nascimento: r.data_nascimento ?? "",
      curso: r.curso ?? "",
      nivel: r.nivel ?? "Certificado",
      ano_conclusao: anoDe(r.ano_conclusao, r.data_emissao),
      instituicao: r.instituicao ?? "",
      estado: r.estado ?? "",
      cidade: r.cidade ?? "",
      endereco: r.endereco ?? "",
      registro: r.registro ?? r.codigo,
      data_emissao: (r.data_emissao ?? "").slice(0, 10),
      ativo: r.ativo ?? true,
    };
  }

  // 3) Certificados relacionais (certificates + students + courses + institutions).
  const { data: cert } = await supabase
    .from("certificates")
    .select(
      "code, type, estado, issued_at, status, students(full_name, cpf, birth_date), courses(name), institutions(name, city, address)",
    )
    .eq("code", codigo)
    .maybeSingle();

  if (cert) {
    const c = cert as Record<string, any>;
    return {
      codigo: c.code,
      nome: c.students?.full_name ?? "",
      cpf: c.students?.cpf ?? "",
      data_nascimento: c.students?.birth_date ?? "",
      curso: c.courses?.name ?? "",
      nivel: c.type === "superior" ? "Ensino Superior" : "Curso Livre",
      ano_conclusao: anoDe(null, c.issued_at),
      instituicao: c.institutions?.name ?? "",
      estado: c.estado ?? "",
      cidade: c.institutions?.city ?? "",
      endereco: c.institutions?.address ?? "",
      registro: c.code,
      data_emissao: (c.issued_at ?? "").slice(0, 10),
      ativo: c.status !== "cancelado",
    };
  }

  return null;
}
