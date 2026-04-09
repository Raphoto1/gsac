"use client";

import type { ReactElement } from "react";
import { createElement, useEffect, useRef } from "react";
import * as THREE from "three";

import CompanyCard from "@/components/CompanyCard";

type CompanyListItem = {
  name: string;
  description: string;
  logo: string;
};

type DesktopCardAnchor = {
  horizontalSide: "left" | "right";
  verticalSide: "top" | "bottom";
  x: number;
  y: number;
};

const element = createElement;
const layoutTuning = {
  xCloseness: 0,
  yCloseness: 0,
};
const desktopCardAnchors: DesktopCardAnchor[] = [
  { horizontalSide: "left", verticalSide: "top", x: 18, y: 4.75 },
  { horizontalSide: "right", verticalSide: "top", x: 15, y: 4.25 },
  { horizontalSide: "left", verticalSide: "bottom", x: 15, y: 3.5 },
  { horizontalSide: "right", verticalSide: "bottom", x: 18, y: 3 },
];

function compactSignedValue(value: number, amount: number) {
  const sign = Math.sign(value) || 1;
  return value - sign * amount;
}

function getDesktopCardStyle(anchor: DesktopCardAnchor) {
  return {
    [anchor.horizontalSide]: `${anchor.x + layoutTuning.xCloseness}rem`,
    [anchor.verticalSide]: `${anchor.y + layoutTuning.yCloseness}rem`,
  };
}

function disposeMesh(mesh: THREE.Mesh) {
  mesh.geometry.dispose();
  if (Array.isArray(mesh.material)) {
    mesh.material.forEach((material) => material.dispose());
    return;
  }

  mesh.material.dispose();
}

function createCurvedLine(curve: THREE.QuadraticBezierCurve3, material: THREE.LineDashedMaterial) {
  const geometry = new THREE.BufferGeometry().setFromPoints(curve.getPoints(48));
  const line = new THREE.Line(geometry, material);
  line.computeLineDistances();
  return line;
}

function createConnectionCurve(start: THREE.Vector3, end: THREE.Vector3, arcHeight: number, depthOffset: number) {
  const midpoint = start.clone().lerp(end, 0.5);
  midpoint.y += arcHeight;
  midpoint.z += depthOffset;
  return new THREE.QuadraticBezierCurve3(start.clone(), midpoint, end.clone());
}

type CompanyListThreeSceneProps = {
  companies: CompanyListItem[];
};

export default function CompanyListThreeScene({ companies }: CompanyListThreeSceneProps): ReactElement {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;

    if (!canvas) {
      return undefined;
    }

    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(38, 1, 0.1, 100);
    camera.position.set(0, 0.4, 11);

    const networkGroup = new THREE.Group();
    scene.add(networkGroup);

    const xNodeCompaction = layoutTuning.xCloseness * 0.22;
    const yNodeCompaction = layoutTuning.yCloseness * 0.18;

    const nodePositions = [
      new THREE.Vector3(compactSignedValue(-2.7, xNodeCompaction), compactSignedValue(1.95, yNodeCompaction), 0.15),
      new THREE.Vector3(compactSignedValue(2.65, xNodeCompaction), compactSignedValue(1.8, yNodeCompaction), -0.08),
      new THREE.Vector3(compactSignedValue(-1.05, xNodeCompaction * 0.8), compactSignedValue(-2.35, yNodeCompaction), 0.18),
      new THREE.Vector3(compactSignedValue(1.1, xNodeCompaction * 0.8), compactSignedValue(-2.3, yNodeCompaction), -0.12),
    ];

    const primaryConnections = [
      { pair: [0, 1] as const, arcHeight: 0.55, depthOffset: 0.08 },
      { pair: [0, 2] as const, arcHeight: -0.48, depthOffset: 0.08 },
      { pair: [1, 3] as const, arcHeight: -0.46, depthOffset: -0.03 },
      { pair: [2, 3] as const, arcHeight: 0.22, depthOffset: 0.02 },
    ];
    const secondaryConnections = [
      { pair: [0, 3] as const, arcHeight: 0.04, depthOffset: 0.18 },
      { pair: [1, 2] as const, arcHeight: -0.08, depthOffset: 0.18 },
    ];

    const primaryLineMaterial = new THREE.LineDashedMaterial({
      color: 0x0d679a,
      transparent: true,
      opacity: 0.42,
      dashSize: 0.16,
      gapSize: 0.13,
      scale: 1,
    });
    const secondaryLineMaterial = new THREE.LineDashedMaterial({
      color: 0x0d679a,
      transparent: true,
      opacity: 0.12,
      dashSize: 0.08,
      gapSize: 0.16,
      scale: 1,
    });

    const primaryCurves = primaryConnections.map(({ pair: [startIndex, endIndex], arcHeight, depthOffset }) =>
      createConnectionCurve(nodePositions[startIndex], nodePositions[endIndex], arcHeight, depthOffset),
    );
    const secondaryCurves = secondaryConnections.map(({ pair: [startIndex, endIndex], arcHeight, depthOffset }) =>
      createConnectionCurve(nodePositions[startIndex], nodePositions[endIndex], arcHeight, depthOffset),
    );
    const animatedCurves = [primaryCurves[0], primaryCurves[1], secondaryCurves[0]];

    const lines = [
      ...primaryCurves.map((curve) => createCurvedLine(curve, primaryLineMaterial)),
      ...secondaryCurves.map((curve) => createCurvedLine(curve, secondaryLineMaterial)),
    ];
    lines.forEach((line) => networkGroup.add(line));

    const sphereGeometry = new THREE.SphereGeometry(0.16, 24, 24);
    const sphereMaterial = new THREE.MeshBasicMaterial({ color: 0x0d679a });
    const nodes = nodePositions.map((position) => {
      const node = new THREE.Mesh(sphereGeometry, sphereMaterial.clone());
      node.position.copy(position);
      networkGroup.add(node);
      return node;
    });

    const glowGeometry = new THREE.SphereGeometry(0.28, 16, 16);
    const glowMaterial = new THREE.MeshBasicMaterial({ color: 0x69c6ff, transparent: true, opacity: 0.18 });
    const glows = nodePositions.map((position) => {
      const glow = new THREE.Mesh(glowGeometry, glowMaterial.clone());
      glow.position.copy(position);
      networkGroup.add(glow);
      return glow;
    });

    const particlesGeometry = new THREE.BufferGeometry();
    const particleCount = 64;
    const particlePositions = new Float32Array(particleCount * 3);
    for (let index = 0; index < particleCount; index += 1) {
      const offset = index * 3;
      particlePositions[offset] = (Math.random() - 0.5) * Math.max(5.5, 8.5 - layoutTuning.xCloseness * 0.75);
      particlePositions[offset + 1] = (Math.random() - 0.5) * Math.max(4.5, 6.1 - layoutTuning.yCloseness * 0.5);
      particlePositions[offset + 2] = (Math.random() - 0.5) * 4;
    }

    particlesGeometry.setAttribute("position", new THREE.BufferAttribute(particlePositions, 3));
    const particlesMaterial = new THREE.PointsMaterial({ color: 0x7fd7ff, size: 0.03, transparent: true, opacity: 0.28 });
    const particles = new THREE.Points(particlesGeometry, particlesMaterial);
    networkGroup.add(particles);

    const animatedDotGeometry = new THREE.SphereGeometry(0.09, 16, 16);
    const animatedDotMaterial = new THREE.MeshBasicMaterial({ color: 0x9fe8ff });
    const animatedDots = animatedCurves.map(() => new THREE.Mesh(animatedDotGeometry, animatedDotMaterial.clone()));
    animatedDots.forEach((dot) => networkGroup.add(dot));

    const parent = canvas.parentElement;
    if (!parent) {
      renderer.dispose();
      return undefined;
    }

    const resize = () => {
      const { clientWidth, clientHeight } = parent;
      renderer.setSize(clientWidth, clientHeight, false);
      camera.aspect = clientWidth / Math.max(clientHeight, 1);
      camera.updateProjectionMatrix();
    };

    resize();
    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(parent);

    let animationFrameId = 0;
    const clock = new THREE.Clock();

    const renderScene = () => {
      const elapsed = clock.getElapsedTime();

      networkGroup.rotation.y = Math.sin(elapsed * 0.18) * 0.08;
      networkGroup.rotation.x = Math.cos(elapsed * 0.14) * 0.025;
      particles.rotation.z = elapsed * 0.02;

      nodes.forEach((node, index) => {
        const scale = 1 + Math.sin(elapsed * 1.5 + index * 0.9) * 0.12;
        node.scale.setScalar(scale);
      });

      glows.forEach((glow, index) => {
        const scale = 1.2 + Math.sin(elapsed * 1.2 + index * 1.1) * 0.22;
        glow.scale.setScalar(scale);
      });

      animatedDots.forEach((dot, index) => {
        const progress = (Math.sin(elapsed * (0.9 + index * 0.18)) + 1) / 2;
        dot.position.copy(animatedCurves[index].getPoint(progress));
      });

      renderer.render(scene, camera);
      animationFrameId = window.requestAnimationFrame(renderScene);
    };

    renderScene();

    return () => {
      window.cancelAnimationFrame(animationFrameId);
      resizeObserver.disconnect();
      lines.forEach((line) => line.geometry.dispose());
      primaryLineMaterial.dispose();
      secondaryLineMaterial.dispose();
      sphereGeometry.dispose();
      glowGeometry.dispose();
      animatedDotGeometry.dispose();
      particlesGeometry.dispose();
      particlesMaterial.dispose();
      nodes.forEach(disposeMesh);
      glows.forEach(disposeMesh);
      animatedDots.forEach(disposeMesh);
      renderer.dispose();
    };
  }, []);

  const desktopCards = companies.map((company, index) =>
    element(
      "div",
      {
        key: company.name,
        className: "hidden md:absolute md:block",
        style: getDesktopCardStyle(desktopCardAnchors[index]),
      },
      element(
        "div",
        {
          className: "w-[18.25rem]",
        },
        element(CompanyCard, company),
      ),
    ),
  );

  const mobileCards = companies.map((company) =>
    element(
      "div",
      {
        key: company.name,
        className: "mx-auto w-full max-w-[18.25rem] md:hidden",
      },
      element(CompanyCard, company),
    ),
  );

  return element(
    "div",
    {
      className: "relative overflow-hidden rounded-[2.4rem] border border-sky-100 bg-white/75 shadow-[0_30px_100px_rgba(15,23,42,0.08)] backdrop-blur-sm",
    },
    element("canvas", {
      ref: canvasRef,
      className: "absolute inset-0 h-full w-full",
      "aria-hidden": true,
    }),
    element("div", {
      className: "pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,_rgba(255,255,255,0.72),_rgba(255,255,255,0.3)_45%,_rgba(255,255,255,0.82))]",
      "aria-hidden": true,
    }),
    element(
      "div",
      {
        className: "relative z-10 flex min-h-[42rem] flex-col gap-10 px-6 py-12 md:min-h-[44rem] md:px-16 md:py-20",
      },
      element(
        "div",
        {
          className: "flex flex-col gap-10 md:hidden",
        },
        ...mobileCards,
      ),
      ...desktopCards,
    ),
  );
}
