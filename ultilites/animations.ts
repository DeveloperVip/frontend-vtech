'use client';

type HeartEffectOptions = {
    count?: number;
    duration?: number;
    size?: number;
    burstOnInit?: boolean;
    overflowHidden?: boolean;
};

type HeartEffectElement = HTMLElement & {
    __heartEffectHandler?: () => void;
};

const randomBetween = (min: number, max: number) => Math.random() * (max - min) + min;

const ensureBurstLayer = (el: HTMLElement) => {
    let layer = el.querySelector<HTMLElement>(':scope > .fx-burst-layer');
    if (!layer) {
        layer = document.createElement('span');
        layer.className = 'fx-burst-layer';
        Object.assign(layer.style, {
            position: 'absolute',
            inset: '0',
            pointerEvents: 'none',
            overflow: 'visible',
            zIndex: '20',
        });
        el.appendChild(layer);
    }
    return layer;
};

export function applyHeartEffect(
    selector: string,
    options: HeartEffectOptions = {}
): void {
    const {
        count = 8,
        duration = 2000,
        size = 10,
        burstOnInit = false,
        overflowHidden = true,
    } = options;

    const elements = document.querySelectorAll<HeartEffectElement>(selector);

    elements.forEach((el) => {
        const computedStyle = window.getComputedStyle(el);
        if (computedStyle.position === 'static') {
            el.style.position = 'relative';
        }
        el.style.overflow = overflowHidden ? 'hidden' : 'visible';

        ensureBurstLayer(el);

        const burst = () => {
            try {
                const activeLayer = ensureBurstLayer(el);
                const baseDuration = Math.max(duration + 240, 980);

                for (let i = 0; i < count; i++) {
                    const particle = document.createElement('span');
                    const core = document.createElement('span');
                    const hue = randomBetween(204, 220);
                    const saturation = randomBetween(72, 86);
                    const lightness = randomBetween(66, 78);
                    const driftX = randomBetween(-34, 34);
                    const driftY = randomBetween(-34, -14);
                    const rotate = randomBetween(-18, 18);
                    const delay = randomBetween(0, 90);
                    const particleSize = randomBetween(size, size + 3);
                    const coreSize = particleSize * randomBetween(0.5, 0.72);
                    const startScale = randomBetween(0.72, 0.92);
                    const midScale = startScale * randomBetween(1.02, 1.08);
                    const endScale = randomBetween(0.54, 0.76);
                    const particleDuration = baseDuration + randomBetween(-180, 80);
                    const coreDuration = baseDuration + randomBetween(-120, 120);

                    particle.textContent = '•';
                    Object.assign(particle.style, {
                        position: 'absolute',
                        left: '50%',
                        top: '50%',
                        transform: 'translate3d(-50%, -50%, 0)',
                        fontSize: `${particleSize}px`,
                        lineHeight: '1',
                        pointerEvents: 'none',
                        userSelect: 'none',
                        color: `hsla(${hue}, ${saturation}%, ${lightness}%, 0.58)`,
                        textShadow: `0 0 ${particleSize * 1.4}px hsla(${hue}, 90%, 78%, 0.2)`,
                        willChange: 'transform, opacity',
                        backfaceVisibility: 'hidden',
                    });

                    Object.assign(core.style, {
                        position: 'absolute',
                        left: '50%',
                        top: '50%',
                        width: `${coreSize}px`,
                        height: `${coreSize}px`,
                        borderRadius: '999px',
                        transform: 'translate3d(-50%, -50%, 0)',
                        background: `radial-gradient(circle, hsla(${hue - 8}, 90%, 96%, 0.52) 0%, hsla(${hue + 4}, 82%, 76%, 0.2) 62%, transparent 100%)`,
                        pointerEvents: 'none',
                        willChange: 'transform, opacity',
                        backfaceVisibility: 'hidden',
                        boxShadow: `0 0 ${particleSize * 1.4}px hsla(${hue}, 82%, 76%, 0.14)`,
                    });

                    activeLayer.appendChild(core);
                    activeLayer.appendChild(particle);

                    const animation = particle.animate(
                        [
                            {
                                transform: `translate3d(-50%, -50%, 0) scale(${startScale}) rotate(0deg)`,
                                opacity: 0,
                                offset: 0,
                            },
                            {
                                transform: `translate3d(calc(-50% + ${driftX * 0.14}px), calc(-50% + ${driftY * 0.12}px), 0) scale(${midScale}) rotate(${rotate * 0.18}deg)`,
                                opacity: 0.98,
                                offset: 0.16,
                            },
                            {
                                transform: `translate3d(calc(-50% + ${driftX * 0.68}px), calc(-50% + ${driftY * 0.66}px), 0) scale(${endScale * 1.06}) rotate(${rotate * 0.62}deg)`,
                                opacity: 0.56,
                                offset: 0.7,
                            },
                            {
                                transform: `translate3d(calc(-50% + ${driftX}px), calc(-50% + ${driftY}px), 0) scale(${endScale}) rotate(${rotate}deg)`,
                                opacity: 0,
                                offset: 1,
                            },
                        ],
                        {
                            duration: particleDuration,
                            delay,
                            easing: 'cubic-bezier(0.19, 1, 0.22, 1)',
                            fill: 'forwards',
                        }
                    );

                    const coreAnimation = core.animate(
                        [
                            {
                                transform: 'translate3d(-50%, -50%, 0) scale(0.36)',
                                opacity: 0,
                                offset: 0,
                            },
                            {
                                transform: `translate3d(calc(-50% + ${driftX * 0.18}px), calc(-50% + ${driftY * 0.16}px), 0) scale(1)`,
                                opacity: 0.78,
                                offset: 0.18,
                            },
                            {
                                transform: `translate3d(calc(-50% + ${driftX * 0.74}px), calc(-50% + ${driftY * 0.72}px), 0) scale(1.22)`,
                                opacity: 0.3,
                                offset: 0.74,
                            },
                            {
                                transform: `translate3d(calc(-50% + ${driftX * 0.96}px), calc(-50% + ${driftY * 0.94}px), 0) scale(1.3)`,
                                opacity: 0,
                                offset: 1,
                            },
                        ],
                        {
                            duration: coreDuration,
                            delay,
                            easing: 'cubic-bezier(0.19, 1, 0.22, 1)',
                            fill: 'forwards',
                        }
                    );

                    let cleanedUp = false;
                    const cleanup = () => {
                        if (cleanedUp) return;
                        cleanedUp = true;
                        particle.remove();
                        core.remove();
                    };

                    animation.addEventListener('finish', cleanup, { once: true });
                    animation.addEventListener('cancel', cleanup, { once: true });
                    // coreAnimation.addEventListener('cancel', cleanup, { once: true });
                }
            } catch (error) {
                console.error('applyHeartEffect burst failed', error, { selector, element: el });
            }
        };

        if (el.__heartEffectHandler) {
            el.removeEventListener('mouseenter', el.__heartEffectHandler);
            el.removeEventListener('pointerenter', el.__heartEffectHandler);
        }

        el.__heartEffectHandler = burst;
        el.addEventListener('mouseenter', burst);
        el.addEventListener('pointerenter', burst);

        if (burstOnInit) {
            requestAnimationFrame(() => burst());
        }
    });
}
