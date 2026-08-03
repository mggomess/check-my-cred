import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

export const consultarCertificado = createServerFn({ method: "GET" })
  .inputValidator((data) => z.object({ codigo: z.string().min(1).max(120) }).parse(data))
  .handler(async ({ data }) => {
    const codigo = data.codigo.trim();

    const { buscarNoEmissor } = await import("./emissor.server");
    const { createClient } = await import("@supabase/supabase-js");

    // 1) Base local de certificados.
    const local = createClient(
      process.env["SUPABASE_URL"]!,
      process.env["SUPABASE_PUBLISHABLE_KEY"]!,
      { auth: { storage: undefined, persistSession: false, autoRefreshToken: false } },
    );

    const { data: antigo } = await local
      .from("certificados")
      .select(
        "codigo,nome,cpf,data_nascimento,curso,nivel,ano_conclusao,instituicao,estado,cidade,endereco,registro,data_emissao,ativo",
      )
      .eq("codigo", codigo)
      .maybeSingle();

    if (antigo) return antigo;

    // 2) Base do sistema emissor (históricos, registros e certificados).
    try {
      return await buscarNoEmissor(codigo);
    } catch (error) {
      console.error("Erro ao consultar base do emissor:", error);
      return null;
    }
  });
