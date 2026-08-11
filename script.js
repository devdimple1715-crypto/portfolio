const BOOT_LINES = [
  "[  OK  ] Started network-online.target",
  "[  OK  ] Mounted /home/dimple",
  "[  OK  ] Reached target cloud-infrastructure.target",
  "[  OK  ] Starting docker.service...",
  "[  OK  ] Starting kubelet.service...",
  "[  OK  ] Starting argocd.service...",
  "[  OK  ] Starting prometheus.service, grafana.service...",
  "[  OK  ] All systems nominal. Cost optimizer: engaged.",
  "",
  "guest@dimple-portfolio:~$ neofetch",
];

function runBootSequence(onDone) {
  const bootScreen = document.getElementById("boot-screen");
  const bootLog = document.getElementById("boot-log");
  let i = 0;

  function nextLine() {
    if (i >= BOOT_LINES.length) {
      bootScreen.classList.add("fade-out");
      setTimeout(() => {
        bootScreen.style.display = "none";
        onDone();
      }, 500);
      return;
    }
    const line = document.createElement("div");
    const isPrompt = BOOT_LINES[i].startsWith("guest@");
    line.className = isPrompt ? "prompt" : "ok";
    line.textContent = BOOT_LINES[i];
    bootLog.appendChild(line);
    i++;
    setTimeout(nextLine, isPrompt ? 900 : 320);
  }

  nextLine();
}

function typeHeader(el, onDone) {
  const text = el.textContent;
  el.textContent = "";
  let i = 0;
  const interval = setInterval(() => {
    i++;
    el.textContent = text.slice(0, i);
    if (i >= text.length) {
      clearInterval(interval);
      const cursor = document.createElement("span");
      cursor.className = "cursor";
      cursor.textContent = "_";
      el.after(cursor);
      onDone();
    }
  }, 110);
}

function revealInSequence(nodes, stepDelay) {
  nodes.forEach((node, index) => {
    setTimeout(() => node.classList.add("show"), index * stepDelay);
  });
}

function initScrollReveal() {
  const panels = document.querySelectorAll(".panel");
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("show");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15 }
  );
  panels.forEach((panel) => observer.observe(panel));
}

const COMMANDS = {
  help() {
    return [
      "available commands:",
      "  whoami        short bio",
      "  experience    jump to work history",
      "  projects      jump to projects",
      "  education     jump to education",
      "  skills        list the stack",
      "  stats         impact numbers",
      "  contact       jump to contact info",
      "  resume        download the resume PDF",
      "  sudo          try it and see",
      "  clear         clear this terminal",
    ].join("\n");
  },
  resume() {
    const link = document.createElement("a");
    link.href = "Dimple-Devops.pdf";
    link.download = "Dimple-Dhiman-Resume.pdf";
    link.click();
    return "downloading Dimple-Dhiman-Resume.pdf...";
  },
  whoami() {
    return "Dimple Dhiman — DevOps Engineer @ Idea Clan Pvt Ltd. ~4 years building cloud infra that (mostly) doesn't page anyone at 3am.";
  },
  skills() {
    return "AWS, GCP, Kubernetes/EKS, Docker, Karpenter, KEDA, Terraform, Helm, ArgoCD, Prometheus, Grafana, Datadog, MongoDB, PostgreSQL, Bash, Python.";
  },
  stats() {
    return "120+ EKS nodes managed · 1,500+ pods orchestrated · 35% faster deploys · 30% cloud cost cut via KEDA · 30% saved migrating AWS to GCP.";
  },
  sudo() {
    return "guest is not in the sudoers file. This incident will be reported. (it will not, but nice try)";
  },
  clear() {
    document.getElementById("cmd-output").textContent = "";
    return null;
  },
};

const SCROLL_TARGETS = {
  experience: "experience",
  projects: "projects",
  education: "education",
  contact: "contact",
};

function initCommandTerminal() {
  const input = document.getElementById("cmd-input");
  const output = document.getElementById("cmd-output");
  if (!input || !output) return;

  input.addEventListener("keydown", (event) => {
    if (event.key !== "Enter") return;
    const raw = input.value.trim();
    input.value = "";
    if (!raw) return;

    const echo = document.createElement("div");
    echo.className = "cmd-echo";
    echo.textContent = raw;
    output.appendChild(echo);

    const cmd = raw.toLowerCase();
    let response;

    if (SCROLL_TARGETS[cmd]) {
      const target = document.getElementById(SCROLL_TARGETS[cmd]);
      target.scrollIntoView({ behavior: "smooth", block: "start" });
      response = `scrolling to ${cmd}...`;
    } else if (COMMANDS[cmd]) {
      response = COMMANDS[cmd]();
    } else {
      response = `command not found: ${raw}. type 'help' for options.`;
    }

    if (response) {
      const line = document.createElement("div");
      line.textContent = response;
      output.appendChild(line);
    }
    output.scrollTop = output.scrollHeight;
  });
}

document.addEventListener("DOMContentLoaded", () => {
  const asciiArt = document.getElementById("ascii-art");
  const asciiLines = asciiArt.textContent.split("\n");
  asciiArt.innerHTML = asciiLines
    .map((line) => `<span class="ascii-line">${line}</span>`)
    .join("");
  const asciiSpans = asciiArt.querySelectorAll(".ascii-line");

  const infoRows = document.querySelectorAll(".info .row:not(.header)");
  const header = document.querySelector(".user");

  initCommandTerminal();

  runBootSequence(() => {
    typeHeader(header, () => {
      revealInSequence(asciiSpans, 35);
      revealInSequence(infoRows, 100);
    });
    initScrollReveal();
  });
});
