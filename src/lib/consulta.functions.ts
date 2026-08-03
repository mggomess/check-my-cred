import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

export const consultarCertificado = createServerFn({ method: "GET" })
  .inputValidator((data) => z.object({ codigo: z.string().min(1).max(120) }).parse(data))
  .handler(async ({ data }) => {
    const codigo = data.codigo.trim();

    const { buscarNoEmissor, buscarNoEndpointPublico } = await import("./emissor.server");
    const { createClient } = await import("@supabase/supabase-js");

    let houveErro = false;

    // 1) Endpoint público do sistema emissor (QR Code).
    try {
      const publico = await buscarNoEndpointPublico(codigo);
      if (publico) return { status: "encontrado" as const, certificado: publico };
    } catch (error) {
      houveErro = true;
      console.error("Erro ao consultar endpoint público do emissor:", error);
    }

    // 2) Base local de certificados.
    try {
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

      if (antigo) return { status: "encontrado" as const, certificado: antigo };
    } catch (error) {
      houveErro = true;
      console.error("Erro ao consultar base local:", error);
    }

    // 3) Base do sistema emissor (históricos, registros e certificados).
    try {
      const remoto = await buscarNoEmissor(codigo);
      if (remoto) return { status: "encontrado" as const, certificado: remoto };
    } catch (error) {
      houveErro = true;
      console.error("Erro ao consultar base do emissor:", error);
    }

    return {
      status: houveErro ? ("erro" as const) : ("nao_encontrado" as const),
      certificado: null,
    };
  });
