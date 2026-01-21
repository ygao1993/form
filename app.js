const STORAGE_KEY = "crea_form_v1";

const defaultState = {
  page: 1,
  data: {
    // Página 1
    bairro: "",
    cidade: "São Paulo",
    cep: "",
    empreendimento: "",
    tipo_natureza: "",
    area_m2: "",
    num_pavimentos: "",
    processo_num: "",
    alvara_num: "",
    alvara_data: "",
    proprietario: "",
    cpf_cnpj: "",
    endereco: ""
  }
};

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return structuredClone(defaultState);
    const parsed = JSON.parse(raw);
    return {
      page: parsed?.page ?? defaultState.page,
      data: { ...defaultState.data, ...(parsed?.data || {}) }
    };
  } catch {
    return structuredClone(defaultState);
  }
}

function saveState(state) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (e) {
    console.warn("Falha ao salvar no cache.", e);
  }
}

function setPage(n) {
  const state = loadState();
  state.page = n;
  saveState(state);
}

function goToPage(n) {
  setPage(n);
  window.location.href = `p${n}.html`;
}

/**
 * Liga inputs de uma página ao state.data.
 * Use data-key="nome_do_campo" no input/textarea.
 */
function bindForm() {
  const state = loadState();

  document.querySelectorAll("[data-key]").forEach((el) => {
    const key = el.getAttribute("data-key");

    // preencher ao carregar
    if (el.type === "radio") {
      el.checked = (el.value === (state.data[key] || ""));
    } else {
      el.value = state.data[key] ?? "";
    }

    const handler = () => {
      const s = loadState();

      if (el.type === "radio") {
        if (el.checked) s.data[key] = el.value;
      } else {
        s.data[key] = el.value;
      }

      saveState(s);
    };

    el.addEventListener("input", handler);
    el.addEventListener("change", handler);
  });
}

function ensureOnRightPage(expected) {
  const state = loadState();
  if (state.page !== expected) {
    window.location.replace(`p${state.page}.html`);
  }
}

// Expor funções globais para os botões
window.CREA = {
  loadState,
  saveState,
  goToPage,
  bindForm,
  ensureOnRightPage
};
