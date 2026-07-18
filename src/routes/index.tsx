import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Search } from "lucide-react";
import { Header } from "@/components/Header";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Consulta Pública de Certificados — Sistema Integrado de Educação" },
      {
        name: "description",
        content:
          "Verifique a autenticidade de certificados educacionais informando o código de registro.",
      },
    ],
  }),
  component: Home,
});

function Home() {
  const [codigo, setCodigo] = useState("");
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-100 font-sans">
      <Header />
      <main className="px-4 py-10">
        <section className="mx-auto max-w-2xl rounded-xl bg-white p-8 shadow-sm ring-1 ring-slate-200">
          <h2 className="text-lg font-semibold text-slate-800">
            Verificar autenticidade de certificado
          </h2>
          <p className="mt-1 text-sm text-slate-600">
            Informe o código impresso no certificado para consultar suas informações.
          </p>
          <form
            className="mt-5 flex flex-col gap-3 sm:flex-row"
            onSubmit={(e) => {
              e.preventDefault();
              if (!codigo.trim()) return;
              navigate({
                to: "/certificado/$codigo",
                params: { codigo: codigo.trim() },
              });
            }}
          >
            <input
              value={codigo}
              onChange={(e) => setCodigo(e.target.value)}
              placeholder="Ex.: CERT-2024-0001"
              className="flex-1 rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800 outline-none focus:border-[#0a3d91] focus:ring-2 focus:ring-[#0a3d91]/20"
            />
            <button
              type="submit"
              className="inline-flex items-center justify-center gap-2 rounded-md bg-[#0a3d91] px-4 py-2 text-sm font-medium text-white hover:bg-[#082f70]"
            >
              <Search className="h-4 w-4" />
              Consultar
            </button>
          </form>
        </section>
      </main>
    </div>
  );
}
