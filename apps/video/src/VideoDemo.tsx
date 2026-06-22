import React from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  interpolate,
  Img,
  staticFile,
  Audio,
} from "remotion";

// Helper for typing animation
const useTyping = (text: string, startFrame: number, speed: number = 3) => {
  const frame = useCurrentFrame();
  const charsShown = Math.max(0, Math.floor((frame - startFrame) / speed));
  return text.slice(0, charsShown);
};

// Component for layout headers/footers in pitch deck style
const PitchDeckLayout: React.FC<{
  slideNumber: string;
  slideTitle: string;
  children: React.ReactNode;
}> = ({ slideNumber, slideTitle, children }) => {
  return (
    <AbsoluteFill className="bg-black text-[#e5e2e1] p-16 flex flex-col justify-between select-none">
      {/* Background elegant grid/mesh */}
      <div className="absolute inset-0 opacity-15 pointer-events-none bg-[linear-gradient(to_right,#1f1f1f_1px,transparent_1px),linear-gradient(to_bottom,#1f1f1f_1px,transparent_1px)] bg-[size:4rem_4rem]"></div>
      
      {/* Top Header */}
      <div className="flex justify-between items-center border-b border-neutral-800 pb-4 z-10">
        <div className="flex items-center gap-3">
          <Img src={staticFile("kura-logo-dark-mode.png")} className="h-7 w-auto" />
          <span className="text-neutral-500 font-medium">|</span>
          <span className="text-neutral-400 font-semibold tracking-wider text-xs">DEFI FIREWALL FOR SUI</span>
        </div>
        <div className="text-neutral-500 font-mono text-sm tracking-widest">{slideNumber}</div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col justify-center items-center py-6 z-10 relative">
        {children}
      </div>

      {/* Bottom Footer */}
      <div className="flex justify-between items-center border-t border-neutral-800 pt-4 z-10">
        <div className="text-neutral-500 text-xs tracking-wider font-mono">{slideTitle}</div>
        <div className="text-neutral-500 text-xs font-mono">chat.kura.ai</div>
      </div>
    </AbsoluteFill>
  );
};

export const KuraVideoDemo: React.FC = () => {
  const frame = useCurrentFrame();

  // Define typing hooks at the top level to adhere to Rules of Hooks
  // Adjusted timing for 2:26 limits (4380 frames total)
  const typedTextScene3 = useTyping("Swap 0.5 SUI to USDC", 1085, 3);
  const typedTextScene5 = useTyping("Swap 100 SUI to RANDOM", 2620, 3);
  const typedTextConfirmation = useTyping("KONFIRMASI", 2930, 4);

  // Timing constants (in frames)
  // Scene 1: 0 - 390 (13s)
  // Scene 2: 390 - 1035 (21.5s)
  // Scene 3: 1035 - 1680 (21.5s)
  // Scene 4: 1680 - 2580 (30s)
  // Scene 5: 2580 - 3225 (21.5s)
  // Scene 6: 3225 - 3735 (17s)
  // Scene 7: 3735 - 4380 (21.5s)

  let content: React.ReactNode = null;

  // ----------------------------------------------------
  // SCENE 1: COLD OPEN (0 - 390)
  // ----------------------------------------------------
  if (frame < 390) {
    const opacity1 = interpolate(frame, [0, 15, 80, 95], [0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
    const opacity2 = interpolate(frame, [100, 110, 190, 200], [0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
    const opacity3 = interpolate(frame, [200, 210, 280, 290], [0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
    const opacity4 = interpolate(frame, [290, 310], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

    // Hex blob generation
    const hexLines = [
      "0x00000000: 55 89 e5 53 83 ec 08 83 e4 f0 e8 00 00 00 00 5b",
      "0x00000010: 81 c3 3c 1a 00 00 8b 45 08 8b 55 0c 89 44 24 04",
      "0x00000020: 89 1c 24 e8 fa fe ff ff 8b 5d fc c9 c3 90 90 90",
      "0x00000030: 55 89 e5 83 ec 08 83 e4 f0 8b 45 08 8b 55 0c 89"
    ];

    const isPulseActive = Math.floor(frame / 15) % 2 === 0;

    content = (
      <AbsoluteFill className="bg-black text-white flex justify-center items-center font-sans p-16">
        {frame < 100 && (
          <div style={{ opacity: opacity1 }} className="text-center">
            <h1 className="text-5xl font-light tracking-wide text-neutral-400">Sign this transaction?</h1>
          </div>
        )}

        {frame >= 100 && frame < 200 && (
          <div style={{ opacity: opacity2 }} className="w-full max-w-3xl glass-card p-8 border border-neutral-800 font-mono text-[#e5e2e1]">
            <div className="flex items-center gap-2 mb-4 border-b border-neutral-800 pb-2 text-neutral-500 text-xs font-mono">
              <span className="w-3 h-3 rounded-full bg-red-500"></span>
              <span>UNTRUSTED HEX TRANSACTION DATA</span>
            </div>
            <div className="space-y-2 text-sm select-none opacity-80">
              {hexLines.map((line, idx) => (
                <div key={idx} className="tracking-widest">
                  {line.slice(0, 12)} <span className="text-red-400">{line.slice(12, 36)}</span> {line.slice(36)}
                </div>
              ))}
            </div>
          </div>
        )}

        {frame >= 200 && frame < 290 && (
          <div style={{ opacity: opacity3 }} className="text-center flex flex-col items-center justify-center gap-4">
            <div 
              style={{ opacity: isPulseActive ? 1 : 0.4 }}
              className="text-red-500 font-extrabold text-7xl tracking-tighter uppercase transition-opacity duration-300"
            >
              YOU JUST LOST EVERYTHING
            </div>
          </div>
        )}

        {frame >= 290 && (
          <div style={{ opacity: opacity4 }} className="text-center flex flex-col items-center justify-center gap-6">
            <Img src={staticFile("kura-logo-dark-mode.png")} className="h-28 w-auto mb-4" />
            <h2 className="text-4xl font-bold tracking-tight text-[#e5e2e1]">Don't Blind Sign. Kura Sign.</h2>
            <p className="text-neutral-500 font-mono tracking-widest uppercase text-sm">The DeFi Firewall for Sui</p>
          </div>
        )}
      </AbsoluteFill>
    );

  // ----------------------------------------------------
  // SCENE 2: CONNECT & FAUCET (390 - 1035)
  // ----------------------------------------------------
  } else if (frame < 1035) {
    const walletConnectFrame = 480;
    const connectedFrame = 570;
    const chipsFrame = 660;
    const claimFrame = 800;

    const modalOpacity = interpolate(frame, [walletConnectFrame, walletConnectFrame + 10, connectedFrame, connectedFrame + 10], [0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
    const isConnected = frame >= connectedFrame;
    const showChips = frame >= chipsFrame;
    const isClaimed = frame >= claimFrame;
    const showGasFee = frame >= claimFrame + 20;

    content = (
      <PitchDeckLayout slideNumber="02" slideTitle="CONNECT WALLET & SPONSORED FAUCET">
        <div className="w-full max-w-5xl flex gap-6 h-full items-stretch">
          
          <div className="flex-1 glass-card border border-neutral-800 p-6 flex flex-col justify-between">
            <div className="flex justify-between items-center border-b border-neutral-900 pb-3">
              <span className="font-mono text-sm tracking-wide text-neutral-400">chat.kura.ai</span>
              <button className={`px-4 py-1.5 rounded-full text-xs font-semibold font-mono border transition-all duration-300 ${
                isConnected 
                ? "bg-emerald-950/40 text-emerald-400 border-emerald-500/30" 
                : "bg-white text-black border-white"
              }`}>
                {isConnected ? "Connected: 0x9f...a8" : "Connect Wallet"}
              </button>
            </div>

            <div className="flex-1 flex flex-col justify-center items-center gap-4 py-8">
              {isConnected ? (
                <div className="text-center w-full max-w-md">
                  <div className="text-neutral-400 text-sm mb-4">Welcome back! Claim test tokens to start swapping.</div>
                  <button className={`w-full py-3 rounded-lg font-bold transition-all duration-300 ${
                    isClaimed 
                    ? "bg-neutral-900 text-neutral-500 border border-neutral-800 cursor-not-allowed" 
                    : "bg-emerald-500 text-black hover:bg-emerald-400"
                  }`}>
                    {isClaimed ? "✓ 1000 USDC Claimed" : "Claim 1000 USDC"}
                  </button>
                </div>
              ) : (
                <div className="text-neutral-500 font-mono text-xs">Waiting for wallet connection...</div>
              )}
            </div>

            <div className="h-16 flex items-center justify-center gap-3 overflow-hidden border-t border-neutral-900 pt-3">
              {showChips && (
                <>
                  <span className="px-3 py-1 bg-neutral-900 border border-neutral-800 text-neutral-400 text-xs rounded-full cursor-pointer">Tukar SUI ke USDC</span>
                  <span className="px-3 py-1 bg-neutral-900 border border-neutral-800 text-neutral-400 text-xs rounded-full cursor-pointer">Stake SUI</span>
                  <span className="px-3 py-1 bg-neutral-900 border border-neutral-800 text-neutral-400 text-xs rounded-full cursor-pointer">Cek Saldo</span>
                </>
              )}
            </div>
          </div>

          <div className="w-80 flex flex-col gap-4">
            {frame >= walletConnectFrame && frame < connectedFrame && (
              <div style={{ opacity: modalOpacity }} className="flex-1 glass-card border border-neutral-800 p-5 flex flex-col justify-between">
                <div>
                  <h3 className="font-bold text-sm mb-3 text-neutral-200">Sui Wallet Connection</h3>
                  <p className="text-neutral-500 text-xs mb-4">kura.ai is requesting access to view your wallet balance and activity.</p>
                </div>
                <div className="space-y-2">
                  <div className="w-full py-2 bg-neutral-900 text-neutral-300 text-xs rounded text-center font-semibold cursor-pointer">Cancel</div>
                  <div className="w-full py-2 bg-emerald-500 text-black text-xs rounded text-center font-bold cursor-pointer">Approve Connection</div>
                </div>
              </div>
            )}

            {showGasFee && (
              <div className="flex-1 glass-card border border-neutral-800 p-5 flex flex-col justify-between glow-green">
                <div>
                  <div className="flex items-center justify-between border-b border-neutral-800 pb-2 mb-3">
                    <span className="text-xs font-bold text-emerald-400 tracking-wider">SPONSORED TRANSACTION</span>
                    <span className="text-[10px] bg-emerald-950/50 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded-full">FREE</span>
                  </div>
                  <div className="space-y-3 font-mono">
                    <div className="flex justify-between text-xs">
                      <span className="text-neutral-500">Operation:</span>
                      <span className="text-neutral-300">Claim Faucet</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-neutral-500">Sponsor:</span>
                      <span className="text-emerald-400 font-semibold">Kura Gas Pay</span>
                    </div>
                    <div className="flex justify-between text-xs border-t border-neutral-900 pt-2">
                      <span className="text-neutral-400">Actual Gas Fee:</span>
                      <span className="text-neutral-400 line-through">0.0035 SUI</span>
                    </div>
                  </div>
                </div>
                <div className="bg-emerald-950/20 border border-emerald-500/20 rounded p-3 text-center">
                  <span className="text-xs text-neutral-400">You pay</span>
                  <div className="text-xl font-bold text-emerald-400 font-mono mt-0.5">$0.00</div>
                </div>
              </div>
            )}
          </div>

        </div>
      </PitchDeckLayout>
    );

  // ----------------------------------------------------
  // SCENE 3: INTENT PARSING (1035 - 1680)
  // ----------------------------------------------------
  } else if (frame < 1680) {
    const inputStartFrame = 1085;
    const step1Frame = 1235;
    const step2Frame = 1380;
    const step3Frame = 1520;

    content = (
      <PitchDeckLayout slideNumber="03" slideTitle="NATURAL LANGUAGE INTENT PARSING">
        <div className="w-full max-w-4xl flex flex-col gap-6">
          <div className="glass-card border border-neutral-800 p-5 flex items-center justify-between">
            <div className="flex items-center gap-3 w-full">
              <span className="text-emerald-500 font-mono font-bold text-lg select-none">&gt;</span>
              <span className="text-[#e5e2e1] text-lg font-medium cursor">{typedTextScene3}</span>
            </div>
            {frame >= inputStartFrame + 60 && (
              <span className="text-xs bg-neutral-900 border border-neutral-800 px-3 py-1 rounded text-neutral-400 font-mono">ENTER</span>
            )}
          </div>

          <div className="grid grid-cols-3 gap-4 h-52">
            {frame >= step1Frame && (
              <div className="glass-card border border-neutral-800 p-5 flex flex-col justify-between glow-green">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs text-emerald-400 font-mono font-bold uppercase tracking-wider">Step 1: Parser</span>
                    <span className="text-emerald-500 font-bold">✓</span>
                  </div>
                  <h4 className="font-semibold text-neutral-200 mb-2">Parsing Intent</h4>
                  <p className="text-neutral-400 text-xs font-mono leading-relaxed bg-neutral-950/40 p-2.5 rounded border border-neutral-900">
                    "{`{ action: 'swap', amount: 0.5, from: 'SUI', to: 'USDC' }`}"
                  </p>
                </div>
              </div>
            )}

            {frame >= step2Frame && (
              <div className="glass-card border border-neutral-800 p-5 flex flex-col justify-between glow-green">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs text-emerald-400 font-mono font-bold uppercase tracking-wider">Step 2: Balance</span>
                    <span className="text-emerald-500 font-bold">✓</span>
                  </div>
                  <h4 className="font-semibold text-neutral-200 mb-2">Checking Balance</h4>
                  <p className="text-neutral-400 text-xs font-mono leading-relaxed bg-neutral-950/40 p-2.5 rounded border border-neutral-900">
                    Sufficient Funds:<br/>
                    Balance = 2.3 SUI<br/>
                    Status = OK
                  </p>
                </div>
              </div>
            )}

            {frame >= step3Frame && (
              <div className="glass-card border border-neutral-800 p-5 flex flex-col justify-between glow-green">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs text-emerald-400 font-mono font-bold uppercase tracking-wider">Step 3: Route</span>
                    <span className="text-emerald-500 font-bold">✓</span>
                  </div>
                  <h4 className="font-semibold text-neutral-200 mb-2">Smart Routing</h4>
                  <p className="text-neutral-400 text-xs font-mono leading-relaxed bg-neutral-950/40 p-2.5 rounded border border-neutral-900">
                    Optimal Route Found:<br/>
                    DeepBook V3 Pool<br/>
                    Best execution rate.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </PitchDeckLayout>
    );

  // ----------------------------------------------------
  // SCENE 4: DRY-RUN & GUARDIAN REPORT (1680 - 2580)
  // ----------------------------------------------------
  } else if (frame < 2580) {
    const simulationFrame = 1680;
    const cardFrame = 1880;
    const reportFrame = 2080;

    const showCard = frame >= cardFrame;
    const showReport = frame >= reportFrame;
    
    const isSimPulseActive = Math.floor(frame / 10) % 2 === 0;

    content = (
      <PitchDeckLayout slideNumber="04" slideTitle="SUI VM DRY-RUN & RISK ANALYSIS">
        <div className="w-full max-w-5xl flex gap-6 h-full items-stretch">
          
          <div className="flex-1 glass-card border border-neutral-800 p-6 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 mb-4 border-b border-neutral-900 pb-2 text-neutral-500 text-xs font-mono">
                <span>SIMULATOR CONSOLE</span>
              </div>
              <div className="font-mono text-sm space-y-2.5">
                <div className="text-emerald-400">⚡ Initializing dry-run pipeline...</div>
                <div className="text-neutral-400">✓ Building Programmable Transaction Block (PTB)</div>
                {frame >= simulationFrame + 60 && (
                  <div 
                    style={{ opacity: isSimPulseActive ? 1 : 0.6 }}
                    className="text-cyan-400 font-semibold"
                  >
                    ⚙ Simulating execution on Sui Virtual Machine...
                  </div>
                )}
                {showCard && (
                  <div className="text-emerald-400">✓ Dry-run completed. Outputs captured.</div>
                )}
              </div>
            </div>

            {showCard && (
              <div className="border border-neutral-800 bg-neutral-950/40 rounded-xl p-4 mt-6">
                <div className="text-xs font-mono text-neutral-500 mb-2">TRANSACTION DETAILS (HUMAN READABLE)</div>
                <div className="grid grid-cols-3 gap-4">
                  <div className="bg-neutral-900/50 p-3 rounded border border-neutral-800">
                    <span className="text-[10px] text-neutral-500 uppercase font-mono block">Action</span>
                    <span className="text-sm font-semibold text-neutral-200">Swap SUI</span>
                  </div>
                  <div className="bg-neutral-900/50 p-3 rounded border border-neutral-800">
                    <span className="text-[10px] text-neutral-500 uppercase font-mono block">Volume</span>
                    <span className="text-sm font-semibold text-neutral-200">0.5 SUI → 1.74 USDC</span>
                  </div>
                  <div className="bg-neutral-900/50 p-3 rounded border border-neutral-800">
                    <span className="text-[10px] text-neutral-500 uppercase font-mono block">Protocol Fee</span>
                    <span className="text-sm font-semibold text-neutral-200">0.005 SUI</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="w-80">
            {showReport && (
              <div className="h-full glass-card border border-neutral-800 p-5 flex flex-col justify-between glow-green">
                <div>
                  <div className="flex items-center justify-between border-b border-neutral-800 pb-2.5 mb-4">
                    <span className="text-xs font-bold text-emerald-400 tracking-wider">GUARDIAN REPORT</span>
                    <span className="text-xs bg-emerald-950/50 text-emerald-400 border border-emerald-500/20 px-2.5 py-0.5 rounded-full font-bold">LOW RISK</span>
                  </div>
                  <div className="space-y-4 font-mono">
                    <div>
                      <span className="text-[10px] text-neutral-500 uppercase block mb-1">Risk Evaluation</span>
                      <div className="h-2.5 bg-neutral-900 rounded-full overflow-hidden">
                        <div className="h-full bg-emerald-500 w-1/12"></div>
                      </div>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-neutral-500">Slippage Protection:</span>
                      <span className="text-emerald-400 font-bold">&lt; 0.5%</span>
                    </div>
                    <div className="flex justify-between text-xs border-t border-neutral-900 pt-3">
                      <span className="text-neutral-500">Pool Liquidity:</span>
                      <span className="text-neutral-200 font-semibold">$12.4M</span>
                    </div>
                  </div>
                </div>
                <div className="bg-emerald-950/20 border border-emerald-500/10 rounded-xl p-3 text-center text-xs text-emerald-400">
                  Transaction is safe to sign.
                </div>
              </div>
            )}
          </div>

        </div>
      </PitchDeckLayout>
    );

  // ----------------------------------------------------
  // SCENE 5: THE GUARDIAN SHELL (2580 - 3225)
  // ----------------------------------------------------
  } else if (frame < 3225) {
    const reportFrame = 2730;
    const promptFrame = 2885;
    const cancelFrame = 3050;

    const showReport = frame >= reportFrame;
    const showPrompt = frame >= promptFrame;
    const isCancelled = frame >= cancelFrame;

    content = (
      <PitchDeckLayout slideNumber="05" slideTitle="THE GUARDIAN SHELL (SAFETY TRIGGER)">
        <div className="w-full max-w-5xl flex gap-6 h-full items-stretch">
          
          <div className="flex-1 glass-card border border-neutral-800 p-6 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="glass-card bg-neutral-950 border border-neutral-900 p-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-red-500 font-mono font-bold">&gt;</span>
                  <span className="text-neutral-300 font-mono text-sm cursor">{typedTextScene5}</span>
                </div>
              </div>

              <div className="font-mono text-xs text-neutral-500 space-y-1 p-2">
                <div>&gt; Building PTB... done.</div>
                <div>&gt; Dry-running on Sui VM... complete.</div>
              </div>
            </div>

            <div className="flex gap-4">
              <button className={`flex-1 py-3 rounded-lg font-bold border transition-all text-sm ${
                isCancelled 
                ? "bg-red-950/20 text-red-500 border-red-500/30" 
                : "bg-neutral-900 text-neutral-400 border-neutral-800"
              }`}>
                {isCancelled ? "Cancelled Successfully" : "Cancel"}
              </button>
              <button className="flex-1 py-3 rounded-lg font-bold bg-neutral-900/40 text-neutral-600 border border-neutral-900 cursor-not-allowed text-sm">
                Execute Transaction
              </button>
            </div>
          </div>

          <div className="w-80 flex flex-col gap-4">
            {showReport && (
              <div className="flex-1 glass-card border border-neutral-800 p-5 flex flex-col justify-between glow-red">
                <div>
                  <div className="flex items-center justify-between border-b border-neutral-800 pb-2 mb-3">
                    <span className="text-xs font-bold text-red-500 tracking-wider">GUARDIAN REPORT</span>
                    <span className="text-xs bg-red-950/50 text-red-500 border border-red-500/20 px-2 py-0.5 rounded-full font-bold">CRITICAL</span>
                  </div>
                  <div className="space-y-3 font-mono text-xs">
                    <div>
                      <span className="text-[10px] text-neutral-500 uppercase block mb-1">Risk Evaluation</span>
                      <div className="h-2 bg-neutral-900 rounded-full overflow-hidden">
                        <div className="h-full bg-red-500 w-11/12"></div>
                      </div>
                    </div>
                    <div className="flex justify-between text-neutral-400">
                      <span>Slippage:</span>
                      <span className="text-red-500 font-bold">45.0%</span>
                    </div>
                    <div className="flex justify-between text-neutral-400 border-t border-neutral-900 pt-2">
                      <span>Pool Liquidity:</span>
                      <span className="text-red-400">$1,200</span>
                    </div>
                  </div>
                </div>
                
                {showPrompt && !isCancelled && (
                  <div className="mt-4 border-t border-neutral-800 pt-3">
                    <label className="text-[10px] text-red-500 uppercase block mb-1.5 font-bold">Type verification word to sign:</label>
                    <div className="bg-black border border-red-900/50 p-2 text-center text-xs font-mono text-red-400 select-none cursor">
                      {typedTextConfirmation}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

        </div>
      </PitchDeckLayout>
    );

  // ----------------------------------------------------
  // SCENE 6: EXECUTE & ON-CHAIN AUDIT (3225 - 3735)
  // ----------------------------------------------------
  } else if (frame < 3735) {
    const executeFrame = 3300;
    const successFrame = 3390;
    const auditFrame = 3520;

    const isExecuted = frame >= executeFrame;
    const isSuccess = frame >= successFrame;
    const showAudit = frame >= auditFrame;

    content = (
      <PitchDeckLayout slideNumber="06" slideTitle="IMMUTABLE AUDITING & WALRUS LOGGING">
        <div className="w-full max-w-5xl flex gap-6 h-full items-stretch">
          
          <div className="flex-1 glass-card border border-neutral-800 p-6 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 mb-4 border-b border-neutral-900 pb-2 text-neutral-500 text-xs font-mono">
                <span>TRANSACTION EXECUTION</span>
              </div>
              <div className="font-mono text-sm space-y-3">
                <div className="text-neutral-400">&gt; Prompting wallet signature...</div>
                {isExecuted && (
                  <div className="text-emerald-400 font-bold">&gt; Signed. Broadcasting transaction on Sui...</div>
                )}
                {isSuccess && (
                  <div className="border border-emerald-500/20 bg-emerald-950/20 rounded-xl p-4 mt-4 glow-green">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-bold text-emerald-400 font-sans">✓ Transaction Success</span>
                      <span className="text-xs text-neutral-500 font-mono underline cursor-pointer">SuiScan Link</span>
                    </div>
                    <p className="text-xs text-neutral-400 font-mono">Digest: 8eF9...k7La9</p>
                    <p className="text-xs text-emerald-500 font-mono mt-2">⛽ Gas Fee: $0.00 (Sponsored)</p>
                  </div>
                )}
              </div>
            </div>

            {showAudit && (
              <div className="border border-neutral-800 bg-neutral-950/40 rounded-xl p-4 mt-4">
                <div className="text-xs font-mono text-neutral-500 mb-2">KURALOGGER EMITTED EVENTS</div>
                <div className="space-y-1 text-xs font-mono">
                  <div className="text-[#e5e2e1]"><span className="text-cyan-400">emit_guardian_report</span>(low_risk)</div>
                  <div className="text-[#e5e2e1]"><span className="text-cyan-400">confirm_intent</span>("Swap SUI to USDC")</div>
                  <div className="text-[#e5e2e1]"><span className="text-cyan-400">log_execution</span>(digest="8eF9...k7La9")</div>
                </div>
              </div>
            )}
          </div>

          <div className="w-80">
            {showAudit && (
              <div className="h-full glass-card border border-neutral-800 p-5 flex flex-col justify-between glow-green">
                <div>
                  <div className="flex items-center justify-between border-b border-neutral-800 pb-2.5 mb-4">
                    <span className="text-xs font-bold text-emerald-400 tracking-wider">WALRUS PROTOCOL</span>
                    <span className="text-[10px] bg-cyan-950/50 text-cyan-400 border border-cyan-500/20 px-2 py-0.5 rounded-full font-mono">IMMUTABLE</span>
                  </div>
                  <div className="flex justify-center my-4">
                    <Img src={staticFile("walrus-logo.png")} className="h-16 w-auto" />
                  </div>
                  <div className="space-y-3 font-mono text-[11px] text-neutral-400">
                    <div>
                      <span className="text-[10px] text-neutral-500 block">WALRUS BLOB ID</span>
                      <span className="text-[#e5e2e1] font-semibold break-all">walrus-3a8f9c10...d4e8</span>
                    </div>
                    <p className="border-t border-neutral-900 pt-2 leading-relaxed">
                      Full Guardian Audit Report saved on Walrus decentralized storage.
                    </p>
                  </div>
                </div>
                <div className="bg-cyan-950/20 border border-cyan-500/10 rounded-xl p-3 text-center text-xs text-cyan-400">
                  Decentralized & Auditable
                </div>
              </div>
            )}
          </div>

        </div>
      </PitchDeckLayout>
    );

  // ----------------------------------------------------
  // SCENE 7: MONTAGE & CLOSING (3735 - 4380)
  // ----------------------------------------------------
  } else {
    const closingFrame = 4135;
    if (frame < closingFrame) {
      // 3735 to 4135 (400 frames total for montage slides - 100 frames each)
      const step = Math.floor((frame - 3735) / 100);

      const slides = [
        {
          title: "STAKE SUI",
          desc: "Safe on-chain staking with real-time risk checks.",
          features: ["Low risk profile", "Liquid staking validator selection", "Sponsor sponsored gas support"]
        },
        {
          title: "LEND USDC ON SCALLOP",
          desc: "Automated lending optimization across lending pools.",
          features: ["Smart pool liquidity checking", "Optimal yield verification", "Real-time collateral ratio inspection"]
        },
        {
          title: "BORROW USDC",
          desc: "Risk-guarded borrowing with liquidation safety metrics.",
          features: ["Critical risk warnings on high leverage", "Interactive typing confirmation safeguard"]
        },
        {
          title: "BILINGUAL INTERFACE",
          desc: "Fully functional in both English and Bahasa Indonesia.",
          features: ["Auto intent parsing in local languages", "Localized safety alerts for critical risk"]
        }
      ];

      const currentSlide = slides[step] || slides[3];

      content = (
        <PitchDeckLayout slideNumber="07" slideTitle="POWERFUL DEFI COMMANDS & BILINGUAL SUPPORT">
          <div className="w-full max-w-4xl glass-card border border-neutral-800 p-8 flex flex-col justify-between glow-green">
            <div>
              <div className="flex items-center justify-between border-b border-neutral-900 pb-3 mb-6">
                <span className="text-emerald-400 font-mono font-semibold tracking-wider text-xs uppercase">MONTAGE: ACTION SLIDE {step + 1} OF 4</span>
                <span className="text-neutral-500 text-xs font-mono">10+ Supported DeFi Actions</span>
              </div>
              
              <h3 className="text-4xl font-extrabold text-[#e5e2e1] mb-2 tracking-tight">{currentSlide.title}</h3>
              <p className="text-neutral-400 text-base mb-6">{currentSlide.desc}</p>
              
              <div className="space-y-2">
                {currentSlide.features.map((feature, idx) => (
                  <div key={idx} className="flex items-center gap-3">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                    <span className="text-neutral-300 text-sm font-mono">{feature}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </PitchDeckLayout>
      );
    } else {
      content = (
        <AbsoluteFill className="bg-black text-[#e5e2e1] p-16 flex flex-col justify-center items-center select-none">
          <div className="absolute inset-0 opacity-15 pointer-events-none bg-[linear-gradient(to_right,#1f1f1f_1px,transparent_1px),linear-gradient(to_bottom,#1f1f1f_1px,transparent_1px)] bg-[size:4rem_4rem]"></div>
          
          <div className="text-center flex flex-col items-center justify-center gap-8 z-10">
            <Img src={staticFile("kura-logo-dark-mode.png")} className="h-28 w-auto mb-2" />
            <div>
              <h2 className="text-4xl font-bold tracking-tight text-[#e5e2e1] mb-2">Don't Blind Sign. Kura Sign.</h2>
              <p className="text-neutral-500 font-mono tracking-widest uppercase text-sm">The DeFi Firewall for Sui</p>
            </div>

            <div className="mt-4 px-6 py-2.5 bg-neutral-900 border border-neutral-800 rounded-full font-mono text-emerald-400 text-lg shadow-[0_0_15px_rgba(34,197,94,0.1)]">
              Try Kura
            </div>
            
            <div className="flex gap-4 mt-4">
              <span className="text-neutral-600 text-xs font-mono">Open Source</span>
              <span className="text-neutral-700 font-mono text-xs">•</span>
              <span className="text-neutral-600 text-xs font-mono">Live on Sui</span>
            </div>
          </div>
        </AbsoluteFill>
      );
    }
  }

  return (
    <AbsoluteFill className="bg-black">
      <Audio src={staticFile("speech.mp3")} />
      <Audio src={staticFile("backsound.mp3")} loop volume={0.12} />
      {content}
    </AbsoluteFill>
  );
};
