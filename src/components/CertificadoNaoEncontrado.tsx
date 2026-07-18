import { AlertCircle, ArrowLeft } from "lucide-react";

export function CertificadoNaoEncontrado({ codigo }: { codigo?: string }) {
  return (
    <section className="mx-auto max-w-xl rounded-xl bg-white p-8 text-center shadow-sm ring-1 ring-slate-200">
      <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-50 ring-1 ring-red-100">
        <AlertCircle className="h-8 w-8 text-red-600" />
      </div>
      <h1 className="text-xl font-semibold text-slate-800">
        Certificado não encontrado
      </h1>
      <p className="mt-2 text-sm text-slate-600">
        O código informado é inválido ou não existe.
      </p>
      {codigo && (
        <p className="mt-4 font-mono text-xs text-slate-500">
          Código consultado: <span className="font-semibold">{codigo}</span>
        </p>
      )}
      <button
        onClick={() => window.history.back()}
        className="mt-6 inline-flex items-center gap-2 rounded-md border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-100"
      >
        <ArrowLeft className="h-4 w-4" />
        Voltar
      </button>
    </section>
  );
}
