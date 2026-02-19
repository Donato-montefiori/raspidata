export const gameHtml = `<body>
<div class="stars" id="stars"></div>
    <div class="game-wrapper" id="gameWrapper">
        <div class="header">
            <div class="profile-header" onclick="openProfileModal()">
                <div class="profile-avatar" id="profileAvatar">
                    <div class="avatar-gem"><div class="gem-svg-icon"><svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg"><path d="M 10,20 Q 20,10 30,20 Q 40,30 50,20" stroke="#ffffff" stroke-width="4" stroke-linecap="round" fill="none" opacity="0.9"/><path d="M 10,32 Q 20,22 30,32 Q 40,42 50,32" stroke="#ffffff" stroke-width="4" stroke-linecap="round" fill="none" opacity="0.9"/><path d="M 10,44 Q 20,34 30,44 Q 40,54 50,44" stroke="#ffffff" stroke-width="4" stroke-linecap="round" fill="none" opacity="0.9"/></svg></div></div>
                </div>
                <div class="profile-name-box">
                    <div class="profile-username" id="profileUsername">Jugador</div>
                </div>
                <div class="profile-level-box" onclick="event.stopPropagation(); openLevelInfoModal();">
                    <span class="profile-level-label">Nv</span>
                    <span class="profile-level-value" id="profileLevel">1</span>
                </div>
                <div class="gema-poder-icon" id="gemaPodeIcon" style="display:none;" onclick="event.stopPropagation(); toggleFinalesMenu();">
                    <div class="gem-svg-icon" id="gemaPodeIconSvg"></div>
                    <div class="finales-menu" id="finalesMenu">
                        <div class="finales-menu-slots">
                            <div class="finales-medal-slot" id="medalSlot0" title="PrÃ³ximamente">
                                <span class="medal-placeholder">ðŸ”’</span>
                            </div>
                            <div class="finales-medal-slot" id="medalSlot1" title="PrÃ³ximamente">
                                <span class="medal-placeholder">ðŸ”’</span>
                            </div>
                            <div class="finales-medal-slot" id="medalSlot2" title="PrÃ³ximamente">
                                <span class="medal-placeholder">ðŸ”’</span>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="header-buttons" onclick="event.stopPropagation();">
                    <div class="header-btn" onclick="toggleFullscreen()" title="Pantalla completa">
                        <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                            <!-- top-left -->
                            <path d="M9 3H3v6h2V6.41L8.59 10 10 8.59 6.41 5H9V3z"/>
                            <!-- top-right -->
                            <path d="M15 3v2h2.59L14 8.59 15.41 10 19 6.41V9h2V3h-6z"/>
                            <!-- bottom-left -->
                            <path d="M9 21v-2H6.41L10 15.41 8.59 14 5 17.59V15H3v6h6z"/>
                            <!-- bottom-right -->
                            <path d="M21 15h-2v2.59L15.41 14 14 15.41 17.59 19H15v2h6v-6z"/>
                        </svg>
                    </div>
                    <div class="header-btn" onclick="openSettings()" title="Ajustes">
                        <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path d="M12 15.5A3.5 3.5 0 0 1 8.5 12 3.5 3.5 0 0 1 12 8.5a3.5 3.5 0 0 1 3.5 3.5 3.5 3.5 0 0 1-3.5 3.5m7.43-2.53c.04-.32.07-.64.07-.97 0-.33-.03-.66-.07-1l2.11-1.63c.19-.15.24-.42.12-.64l-2-3.46c-.12-.22-.39-.31-.61-.22l-2.49 1c-.52-.39-1.06-.73-1.69-.98l-.37-2.65A.506.506 0 0 0 14 2h-4c-.25 0-.46.18-.5.42l-.37 2.65c-.63.25-1.17.59-1.69.98l-2.49-1c-.22-.09-.49 0-.61.22l-2 3.46c-.13.22-.07.49.12.64L4.57 11c-.04.34-.07.67-.07 1 0 .33.03.65.07.97l-2.11 1.66c-.19.15-.25.42-.12.64l2 3.46c.12.22.39.3.61.22l2.49-1.01c.52.4 1.06.74 1.69.99l.37 2.65c.04.24.25.42.5.42h4c.25 0 .46-.18.5-.42l.37-2.65c.63-.26 1.17-.59 1.69-.99l2.49 1.01c.22.08.49 0 .61-.22l2-3.46c.12-.22.07-.49-.12-.64l-2.11-1.66z"/>
                        </svg>
                    </div>
                </div>
            </div>
        </div>
        <div class="main-container">
        <div class="panel">
            <div class="gems-balance">
                <div class="label">ðŸª™ Tus Monedas</div>
                <div class="value-row">
                    <span class="value" id="totalGems">1000</span>
                    <span class="max-display">/ <span id="maxGems">10000</span></span>
                    <div style="position: relative;">
                        <button class="expand-btn" onclick="openExpandModal()">+</button>
                        <div class="god-crown" id="godCrown" style="display:none;" onclick="useGodCrown()" title="Â¡Duplica tus gemas!"></div>
                        <div class="equipped-amulet" id="equippedAmuletVisual" style="display:none;" title="Amuleto equipado"></div>
                    </div>
                </div>
            </div>
            <div class="upgrade-section collapsed">
                <div class="upgrade-header" id="upgradeHeader" onclick="toggleUpgrades()"><span class="upgrade-title">â¬†ï¸  Mejoras  ðŸ“ˆ</span><span class="upgrade-caret" id="upgradeCaret">^</span></div>
                <div class="upgrade-item" id="upgradeAlmacenRow">
                    <div class="info">
                        <div id="almacenInfoTitle" style="font-weight:700; color:#e2e8f0;">ðŸ“¦ AlmacÃ©n: Nivel 1</div>
                        <div id="almacenInfoDesc" style="font-size:0.65rem; color:#94a3b8;">Porcentaje venta 66%</div>
                    </div>
                    <button id="upgradeAlmacenBtn" onclick="upgradeAlmacen()">150ðŸ’°</button>
                </div>
                <div class="upgrade-item">
                    <div class="info">
                        <div id="luckInfoTitle" style="font-weight:700; color:#e2e8f0;">ðŸ€ Suerte nivel: 1</div>
                        <div id="luckInfoDesc" style="font-size:0.65rem; color:#94a3b8;">Gemas y fusiÃ³n</div>
                    </div>
                    <button id="upgradeLuckBtn" onclick="upgradeLuck()">500ðŸ’°</button>
                </div>
            </div>
        </div>
        <div class="game-container">
            <div class="ticket-container" id="ticketContainer">
                <div class="scratch-card" id="scratchCard">
                    <div class="empty-ticket-message">ðŸŽ« Compra un ticket para jugar</div>
                </div>
            </div>
            <div class="progress-container">
                <div class="progress-bar"><div class="progress-fill" id="progressFill"></div></div>
            </div>
            <div class="game-buttons">
                <button class="btn-primary" id="newGameBtn">ðŸª™ Raspar (100ðŸª™)</button>
                <button class="btn-favor" id="favorBtn" onclick="activateFavor()">ðŸ¤ Favor</button>
            </div>
            <p class="favor-info" id="favorInfo" style="display:none;">Recibes 150ðŸª™ GRATIS pero debes devolver el favor...</p>
            <div class="circle-btns">
                <div class="raspar-circle-wrapper">
                    <button class="circle-btn btn-raspar-circle" id="rasparCircleBtn" onclick="newGame()">ðŸª™</button>
                    <div class="circle-btn-label">Raspar</div>
                </div>
                <div>
                    <button class="circle-btn btn-almacen" id="btnAlmacen" onclick="openAlmacen()">ðŸ“¦</button>
                    <div class="circle-btn-label">AlmacÃ©n</div>
                </div>
                <div>
                    <button class="circle-btn btn-fusion" id="btnFusion" onclick="openFusion()">âš—ï¸</button>
                    <div class="circle-btn-label">Forja</div>
                </div>
                <div class="compressor-wrapper">
                    <button class="circle-btn btn-compressor" id="btnCompressor" onclick="openCompressor()">ðŸ—œ</button>
                    <div class="circle-btn-label">Compresora</div>
                </div>
                <div>
                    <button class="circle-btn btn-polish" id="btnPolish" onclick="openPolish()">âœ¨</button>
                    <div class="circle-btn-label">Pulido</div>
                </div>
                <div class="pronto-wrapper">
                    <div class="pronto-popup" id="prontoPopup" onclick="event.stopPropagation()">
                        <div class="pronto-popup-title">Gemas Especiales</div>
                        <div class="pronto-popup-gems" id="prontoPopupGems"></div>
                        <div class="pronto-popup-remove" id="prontoRemoveBtn" onclick="removeProntoGem()" style="display:none;">âœ• Quitar</div>
                    </div>
                    <div class="btn-coming-soon" id="btnComingSoon" title="PrÃ³ximamente">?</div>
                    <div class="circle-btn-label">Pronto</div>
                </div>
            </div>
        </div>
    </div>
    </div><!-- cierra game-wrapper -->
    <div class="confetti-container" id="confettiContainer"></div>
    <div class="save-indicator" id="saveIndicator">ðŸ’¾ Guardado</div>
    
    <!-- PrÃ³ximamente Overlay -->
    <div class="proximamente-overlay" id="proximamenteOverlay" onclick="closeProximamente()">
        <div class="proximamente-box" id="proximamenteBox" onclick="event.stopPropagation()">
            <div class="proximamente-title">PrÃ³ximamente</div>
            <div class="proximamente-subtitle">Esta funciÃ³n estÃ¡ en desarrollo...</div>
            <button class="proximamente-close" onclick="closeProximamente()">Entendido</button>
        </div>
    </div>

    <!-- Cryo Freeze Warning (floating-gem style) -->
    <div class="cryo-warn-overlay" id="cryoWarnOverlay">
        <div class="cryo-warn-hint">
            <div class="cryo-warn-hint-main">â„ï¸ No deberÃ­a congelarme sin poder revertirlo...</div>
            <div class="cryo-warn-hint-sub">Esta acciÃ³n no se puede deshacer.</div>
        </div>
        <div class="cryo-warn-btns">
            <button class="cryo-warn-btn-back" onclick="closeCryoWarning()">âœ• Volver</button>
            <button class="cryo-warn-btn-confirm" onclick="confirmCryoFreeze()">Viajar</button>
        </div>
    </div>

    <!-- Portal Warning (travel to World 1) -->
    <div class="cryo-warn-overlay" id="portalWarnOverlay">
        <div class="cryo-warn-hint">
            <div class="cryo-warn-hint-main">ðŸŒ€ Â¿Viajar al mundo principal?</div>
            <div class="cryo-warn-hint-sub">El portal te llevarÃ¡ de vuelta al inicio.</div>
        </div>
        <div class="cryo-warn-btns">
            <button class="cryo-warn-btn-back" onclick="closePortalWarning()">âœ• Cancelar</button>
            <button class="cryo-warn-btn-confirm" style="background:linear-gradient(135deg,#6b7280,#374151);border-color:rgba(156,163,175,0.5);" onclick="confirmPortalTravel()">Entrar al portal</button>
        </div>
    </div>

    <!-- Cryo Iris Wipe (organic frost growth) -->
    <div id="cryoIrisWipe">
        <canvas id="cryoIrisCanvas"></canvas>
    </div>

    <!-- Win Message -->
    <div class="win-message-overlay" id="winMessageOverlay">
        <div class="win-message" id="winMessage">
            <div>
                <div class="new-badge" id="newBadge" style="display:none;">âœ¨ Â¡NUEVA!</div>
                <h2 id="winTitle">Â¡FELICITACIONES!</h2>
                <div class="prize-display" id="winPrizeDisplay">ðŸª™</div>
                <p class="prize-info" id="winPrizeText">Diamante - Legendario</p>
                <p class="prize-value" id="winPrizeValue">+500 ðŸª™</p>
            </div>
            <div class="win-buttons" id="winButtons"></div>
        </div>
    </div>
    
    <!-- Expand Max Modal -->
    <div class="modal-overlay" id="expandModal">
        <div class="modal-content expand-modal">
            <div class="modal-header">
                <div class="modal-header-row">
                    <h2>ðŸ“ˆ Aumentar</h2>
                    <div class="close-slider" data-close-target="expandModal">
                        <div class="slider-track">
                            <div class="slider-knob"></div>
                            <div class="slider-fill"></div>
                            <span class="slider-text">â†’</span>
                        </div>
                    </div>
                </div>
                <p>MÃ¡ximo actual: <span id="currentMaxDisplay">10,000</span> ðŸª™</p>
            </div>
            <div id="expandOptions"></div>
            <button class="close-modal close-modal-red" onclick="closeExpandModal()">Cerrar</button>
        </div>
    </div>
    
    <!-- AlmacÃ©n Modal -->
    <div class="modal-overlay" id="almacenModal">
        <div class="modal-content">
            <div class="modal-header almacen-header">
                <span class="almacen-level" id="almacenLevelDisplay">Nivel: 1</span>
                <div class="modal-header-row">
                    <h2>ðŸ“¦ AlmacÃ©n</h2>
                    <div class="close-slider" data-close-target="almacenModal">
                        <div class="slider-track">
                            <div class="slider-knob"></div>
                            <div class="slider-fill"></div>
                            <span class="slider-text">â†’</span>
                        </div>
                    </div>
                </div>
            </div>
            <div class="tabs">
                <button class="tab active" onclick="showAlmacenTab('base')">ðŸ’Ž Base</button>
                <button class="tab" onclick="showAlmacenTab('created')">ðŸŽ² Creadas</button>
                <button class="tab" onclick="showAlmacenTab('polished')">âœ¨ Pulidas</button>
                <button class="sort-btn desc" id="almacenSortBtn" onclick="toggleAlmacenSort()" title="Ordenar">
                    <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <rect class="sort-lines" x="3" y="4" width="12" height="2.5" rx="1.25"/>
                        <rect class="sort-lines" x="3" y="10" width="9" height="2.5" rx="1.25"/>
                        <rect class="sort-lines" x="3" y="16" width="6" height="2.5" rx="1.25"/>
                        <path class="sort-arrow" d="M18 7 L18 17 M18 17 L15 14 M18 17 L21 14" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                </button>
            </div>
            <div class="grid" id="almacenGrid"></div>
            <button class="close-modal close-modal-red" onclick="closeAlmacen()">Cerrar</button>
        </div>
    </div>
    
    <!-- FusiÃ³n Modal -->
    <div class="modal-overlay" id="fusionModal">
        <div class="modal-content">
            <div class="modal-header">
                <div class="modal-header-row" style="margin-bottom: 5px;">
                    <h2>ðŸ”¥ Forja</h2>
                    <div class="close-slider" data-close-target="fusionModal" style="width: 50px; right: -5px;">
                        <div class="slider-track">
                            <div class="slider-knob"></div>
                            <div class="slider-fill"></div>
                            <span class="slider-text">â†’</span>
                        </div>
                    </div>
                </div>
            </div>
            <div class="fusion-area">
                <div class="fusion-instruction">
                    <p>Selecciona <span class="highlight">2 GEMAS IGUALES</span> para crear una <span class="highlight">NUEVA</span></p>
                </div>
                <div class="fusion-fail-box-compact">
                    <span class="fail-icon">âš ï¸</span>
                    <div class="fail-content">
                        <div class="fail-label">Fallo:</div>
                        <div class="fail-value-compact" id="fusionFailDisplay">16%</div>
                    </div>
                </div>
                <div class="fusion-slots pachinko-machine" id="fusionSlotsContainer">
                    <div class="pachinko-slot" id="fusionSlot1">
                        <div class="slot-reel" id="reel1">
                            <span class="slot-emoji">â“</span>
                        </div>
                        <span class="slot-label">Gema</span>
                    </div>
                    <span class="fusion-arrow">+</span>
                    <div class="pachinko-slot" id="fusionSlot2">
                        <div class="slot-reel" id="reel2">
                            <span class="slot-emoji">â“</span>
                        </div>
                        <span class="slot-label">Igual</span>
                    </div>
                    <span class="fusion-arrow">â†’</span>
                    <div class="pachinko-result" id="fusionResult">
                        <div class="slot-reel" id="reel3">
                            <span class="slot-emoji">âœ¨</span>
                        </div>
                        <span class="slot-label">Nueva</span>
                    </div>
                </div>
                <button class="fusion-btn" id="fusionBtn" onclick="executeFusion()" disabled>âš—ï¸ Fusionar</button>
                <div class="gem-select-title">Elige gema (necesitas Ã—2):</div>
                <div class="gem-select" id="fusionSelect"></div>
            </div>
            <button class="close-modal close-modal-red" onclick="closeFusion()">Cerrar</button>
        </div>
    </div>

    <!-- Compressor Modal -->
    <div class="modal-overlay" id="compressorModal">
        <div class="modal-content">
            <div class="modal-header">
                <div class="modal-header-row">
                    <h2>ðŸ—œ Compresora</h2>
                </div>
            </div>
            <div class="modal-body" style="text-align:center;">
                <p style="color:#9ca3af;font-size:0.7rem;margin-bottom:10px;">Comprime Ã—50 gemas para crear una Singularidad</p>
                <div class="compressor-result" id="compressorResult" style="min-height:70px;display:flex;align-items:center;justify-content:center;margin-bottom:8px;">
                    <span style="color:#555;font-size:2rem;">ðŸ—œ</span>
                </div>
                <button class="fusion-btn" id="compressorBtn" onclick="executeCompression()" disabled>ðŸ—œ Comprimir</button>
                <div class="gem-select-title">Elige gema (necesitas Ã—50):</div>
                <div class="gem-select" id="compressorSelect"></div>
            </div>
            <button class="close-modal close-modal-red" onclick="closeCompressor()">Cerrar</button>
        </div>
    </div>
    
    <!-- Polish Modal -->
    <div class="modal-overlay" id="polishModal">
        <div class="modal-content">
            <div class="modal-header">
                <div class="modal-header-row">
                    <h2>âœ¨ MÃ¡quina de Pulido</h2>
                    <div class="close-slider" data-close-target="polishModal">
                        <div class="slider-track">
                            <div class="slider-knob"></div>
                            <div class="slider-fill"></div>
                            <span class="slider-text">â†’</span>
                        </div>
                    </div>
                </div>
                <p>Cuesta 500ðŸª™ - Multiplicador variable segÃºn tu habilidad</p>
            </div>
            <div class="grid" id="polishGrid"></div>
            <div class="action-panel">
                <p style="color: #a0a0a0; font-size: 0.75rem; margin: 10px 0;"> Puedes pulir gemas por ðŸ’°500 resolviendo un minijuego para aumentar su valor</p>
            </div>
            <button class="close-modal close-modal-red" onclick="closePolish()">Cerrar</button>
        </div>
    </div>

    <!-- Polish Minigame Modal -->
    <div class="modal-overlay" id="polishMinigameModal">
        <div class="modal-content polish-game-content">
            <div class="polish-game-arena" id="polishArena">
                <!-- HUD superior -->
                <div class="polish-hud">
                    <div class="polish-hud-box">â­ <b id="polishCaught">0</b>/10</div>
                    <div class="polish-hud-box">Ã—<b id="polishMult">1.0</b></div>
                </div>
                <div id="polishHeatWarning" style="position: absolute; top: 50px; left: 0; width: 100%; text-align: center; color: #ff4444; font-size: 0.65rem; font-weight: bold; opacity: 0; transition: opacity 0.3s; z-index: 18; padding: 0 20px;">
                    âš ï¸ MantÃ©n la lima centrada para evitar sobrecalentamiento
                </div>
                <!-- Lima -->
                <div class="polish-file-bar" id="polishFile"></div>
                <!-- Gema rotando -->
                <div class="polish-gem-glow"></div>
                <div class="polish-gem-display" id="polishGem"></div>
            </div>
        </div>
    </div>

    <!-- Profile Modal -->
    <div class="modal-overlay" id="profileModal">
        <div class="modal-content profile-modal-content">
            <div class="modal-header">
                <div class="modal-header-row">
                    <h2>ðŸ‘¤ Mi Perfil</h2>
                    <div class="close-slider" data-close-target="profileModal">
                        <div class="slider-track">
                            <div class="slider-knob"></div>
                            <div class="slider-fill"></div>
                            <span class="slider-text">â†’</span>
                        </div>
                    </div>
                </div>
            </div>
            
            <!-- Nombre de usuario -->
            <div class="profile-edit-section">
                <h3>âœï¸ Nombre</h3>
                <input type="text" class="profile-input" id="profileNameInput" maxlength="15" placeholder="Tu nombre..." value="Jugador">
            </div>
            
            <!-- Avatar -->
            <div class="profile-edit-section">
                <h3>ðŸ’Ž Avatar</h3>
                <div class="avatar-grid" id="avatarGrid"></div>
            </div>
            
            <!-- Importar/Exportar -->
            <div class="data-section">
                <h3>ðŸ’¾ Transferir Cuenta</h3>
                <div class="data-buttons">
                    <button class="data-btn export-btn" onclick="exportGameData()">ðŸ“¤ Exportar</button>
                    <button class="data-btn import-btn" onclick="importGameData()">ðŸ“¥ Importar</button>
                </div>
                <div style="position: relative;">
                    <textarea class="data-textarea" id="dataTextarea" placeholder="Los datos de tu cuenta aparecerÃ¡n aquÃ­..."></textarea>
                    <button class="copy-data-btn" id="copyDataBtn" onclick="copyExportData()" title="Copiar">ðŸ“‹</button>
                </div>
                <div class="data-status" id="dataStatus" style="display:none;"></div>
            </div>
            
            <button class="close-modal" onclick="saveProfileAndClose()" style="margin-top: 12px;">âœ“ Guardar</button>
        </div>
    </div>

    <!-- Settings Modal -->
    <div class="modal-overlay" id="settingsModal">
        <div class="modal-content" style="max-width: 320px;">
            <div class="modal-header">
                <div class="modal-header-row">
                    <h2>âš™ï¸ Ajustes</h2>
                    <div class="close-slider" data-close-target="settingsModal">
                        <div class="slider-track">
                            <div class="slider-knob"></div>
                            <div class="slider-fill"></div>
                            <span class="slider-text">â†’</span>
                        </div>
                    </div>
                </div>
            </div>
            <div style="display: flex; flex-direction: column; gap: 15px; padding: 10px 0;">
                <div style="background: rgba(0,0,0,0.25); padding: 15px; border-radius: 12px;">
                    <div style="color: #e2e8f0; font-weight: 600; margin-bottom: 8px;">ðŸ’¾ Datos del Juego</div>
                    <p style="color: #94a3b8; font-size: 0.75rem; margin-bottom: 12px;">Tu progreso se guarda automÃ¡ticamente en este dispositivo.</p>
                </div>
                <div style="background: rgba(0,0,0,0.25); padding: 15px; border-radius: 12px;">
                    <div style="color: #e2e8f0; font-weight: 600; margin-bottom: 8px;">ðŸŽ® Opciones de Juego</div>
                    <div style="display: flex; flex-direction: column; gap: 10px;">
                        <label style="display: flex; align-items: center; gap: 10px; color: #94a3b8; font-size: 0.8rem;">
                            <input type="checkbox" id="instantTicket" onchange="toggleSetting('instantTicket')">
                            Cambio de ticket instantÃ¡neo
                        </label>
                    </div>
                </div>
                <div style="background: rgba(239,68,68,0.15); padding: 15px; border-radius: 12px; border: 1px solid rgba(239,68,68,0.3);">
                    <div style="color: #fca5a5; font-weight: 600; margin-bottom: 8px;">âš ï¸ Zona de Peligro</div>
                    <p style="color: #94a3b8; font-size: 0.75rem; margin-bottom: 12px;">Esta acciÃ³n borrarÃ¡ TODO tu progreso permanentemente.</p>
                    <button onclick="confirmResetGame()" style="width: 100%; padding: 12px; background: linear-gradient(135deg, #ef4444, #dc2626); color: white; border: none; border-radius: 10px; font-weight: 600; cursor: pointer;">ðŸ”„ Reiniciar Juego</button>
                </div>
            </div>
        </div>
    </div>

    <!-- God Crown Confirmation -->
    <div class="crown-confirm-overlay" id="crownConfirmModal">
        <div class="crown-confirm-box">
            <div class="crown-confirm-icon">ðŸ‘‘</div>
            <div class="crown-confirm-title">Utilizar esta corona duplicarÃ¡ tu plata actual.<br><br>Â¿Quieres utilizar la Corona de Dios?</div>
            <div class="crown-confirm-buttons">
                <button class="crown-btn-cancel" onclick="closeCrownConfirm()">Rechazar</button>
                <button class="crown-btn-use" onclick="confirmUseGodCrown()">âœ¨ Usar</button>
            </div>
        </div>
    </div>

    <!-- Amulet Info Modal -->
    <div class="amulet-info-overlay" id="amuletInfoModal">
        <div class="amulet-info-box">
            <div class="amulet-info-slider-wrap">
                <div class="close-slider" data-close-target="amuletInfoModal">
                    <div class="slider-track">
                        <div class="slider-knob"></div>
                        <div class="slider-fill"></div>
                        <span class="slider-text">â†’</span>
                    </div>
                </div>
            </div>
            <div class="amulet-info-icon" id="amuletInfoIcon"></div>
            <div class="amulet-info-name" id="amuletInfoName"></div>
            <div class="amulet-info-desc" id="amuletInfoDesc"></div>
            <div id="focusGemSelector" style="display:none; margin: 12px 0;">
                <label style="color:#a0aec0; font-size:0.75rem; display:block; margin-bottom:6px;">ðŸŽ¯ Gema Objetivo:</label>
                <select id="focusGemSelect" class="creative-select" style="width:100%; font-size:0.8rem;" onchange="setFocusGem(this.value)">
                </select>
                <div id="focusGemCurrent" style="color:#ffd700; font-size:0.7rem; margin-top:6px;"></div>
            </div>
            <button class="amulet-info-unequip" id="amuletInfoAcceptBtn" onclick="closeAmuletInfoModal()">Aceptar</button>
        </div>
    </div>

    <!-- Creative Mode Menu -->
    <div class="creative-menu-overlay" id="creativeMenuModal">
        <div class="creative-menu-box">
            <div class="creative-slider-wrap">
                <div class="close-slider" data-close-target="creativeMenuModal">
                    <div class="slider-track">
                        <div class="slider-knob"></div>
                        <div class="slider-fill"></div>
                        <span class="slider-text">â†’</span>
                    </div>
                </div>
            </div>
            <div class="creative-menu-title">ðŸŽ¨ Modo Creativo</div>
            <div class="creative-menu-subtitle">Modifica el juego a tu antojo</div>

            <!-- Plata -->
            <div class="creative-section collapsed">
                <div class="creative-section-title" onclick="this.parentElement.classList.toggle('collapsed')">ðŸª™ Plata</div>
                <div class="creative-section-body">
                <div class="creative-row">
                    <label>Dar plata</label>
                    <input type="number" class="creative-input" id="creativeSilverAmount" value="10000" min="0">
                    <button class="creative-btn gold" onclick="creativeGiveSilver()">Dar</button>
                </div>
                <div class="creative-row">
                    <label>MÃ¡ximo de plata</label>
                    <input type="number" class="creative-input" id="creativeMaxSilver" value="50000" min="1000">
                    <button class="creative-btn blue" onclick="creativeSetMaxSilver()">Set</button>
                </div>
                </div>
            </div>

            <!-- Mejoras -->
            <div class="creative-section collapsed">
                <div class="creative-section-title" onclick="this.parentElement.classList.toggle('collapsed')">â¬†ï¸ Mejoras</div>
                <div class="creative-section-body">
                <div class="creative-row">
                    <label>Nivel de Suerte (0-9)</label>
                    <input type="number" class="creative-input" id="creativeLuckLevel" value="9" min="0" max="9">
                    <button class="creative-btn blue" onclick="creativeSetLuck()">Set</button>
                </div>
                <div class="creative-row">
                    <label>Nivel de AlmacÃ©n (0-10)</label>
                    <input type="number" class="creative-input" id="creativeAlmacenLevel" value="10" min="0" max="10">
                    <button class="creative-btn blue" onclick="creativeSetAlmacen()">Set</button>
                </div>
                <div class="creative-row">
                    <label>Gemas Infinitas</label>
                    <input type="checkbox" id="creativeInfiniteGems" style="width:18px;height:18px;cursor:pointer;">
                    <button class="creative-btn blue" onclick="creativeToggleInfinite()">Aplicar</button>
                </div>
                </div>
            </div>

            <!-- Items (Gemas + Fusiones + Amuletos + Dar Todo) -->
            <div class="creative-section collapsed">
                <div class="creative-section-title" onclick="this.parentElement.classList.toggle('collapsed')">ðŸ’Ž Items</div>
                <div class="creative-section-body">
                <div style="color:#ff8888;font-size:0.65rem;font-weight:600;margin-bottom:6px;font-family:'Poppins',sans-serif;">Gemas</div>
                <div class="creative-row">
                    <select class="creative-select" id="creativeGemSelect"></select>
                    <input type="number" class="creative-input" id="creativeGemAmount" value="50" min="1" style="width:60px;">
                    <button class="creative-btn green" onclick="creativeGiveGem()">Dar</button>
                </div>
                <div style="color:#ff8888;font-size:0.65rem;font-weight:600;margin:8px 0 6px;font-family:'Poppins',sans-serif;">Fusiones</div>
                <div class="creative-row">
                    <select class="creative-select" id="creativeFusionSelect"></select>
                    <input type="number" class="creative-input" id="creativeFusionAmount" value="10" min="1" style="width:60px;">
                    <button class="creative-btn green" onclick="creativeGiveFusion()">Dar</button>
                </div>
                <div style="color:#ff8888;font-size:0.65rem;font-weight:600;margin:8px 0 6px;font-family:'Poppins',sans-serif;">Amuletos</div>
                <div class="creative-row">
                    <select class="creative-select" id="creativeAmuletSelect">
                        <option value="amuleto_presion">Amuleto PresiÃ³n</option>
                        <option value="amuleto_focus">Amuleto Focus</option>
                        <option value="amuleto_fortuna">Amuleto Fortuna</option>
                        <option value="amuleto_suerte">Amuleto Suerte</option>
                        <option value="corona_dios">Corona de Dios</option>
                    </select>
                    <button class="creative-btn green" onclick="creativeGiveAmulet()">Dar</button>
                    <button class="creative-btn blue" onclick="creativeEquipAmulet()">Equipar</button>
                </div>
                <hr style="border:none;border-top:1px solid rgba(255,255,255,0.08);margin:10px 0;">
                <div class="creative-row">
                    <button class="creative-btn gold" onclick="creativeGiveAll()" style="flex:1;">ðŸŽ Dar todas las gemas, fusiones y amuletos</button>
                </div>
                </div>
            </div>

            <!-- Probabilidades -->
            <div class="creative-section collapsed">
                <div class="creative-section-title" onclick="this.parentElement.classList.toggle('collapsed')">ðŸŽ² Probabilidades de ApariciÃ³n</div>
                <div class="creative-section-body">
                <div id="creativeChanceList"></div>
                <div class="creative-row" style="margin-top:8px;">
                    <button class="creative-btn gold" onclick="creativeApplyChances()">Aplicar Cambios</button>
                    <button class="creative-btn" onclick="creativeResetChances()">Reset</button>
                </div>
                </div>
            </div>

            <button class="close-modal close-modal-red" onclick="closeCreativeMenu()" style="margin-top:12px;">Cerrar</button>
        </div>
    </div>

    <!-- Level Info Modal -->
    <div class="level-info-overlay" id="levelInfoModal">
        <div class="level-info-box">
            <div class="level-info-slider-wrap">
                <div class="close-slider" data-close-target="levelInfoModal">
                    <div class="slider-track">
                        <div class="slider-knob"></div>
                        <div class="slider-fill"></div>
                        <span class="slider-text">â†’</span>
                    </div>
                </div>
            </div>
            <div class="level-info-title">ðŸ“Š Tu Nivel ðŸ“Š</div>
            <div class="level-info-current" id="levelInfoCurrent">1</div>
            <div class="level-info-subtitle">QuÃ© cosas te suben de nivel</div>
            <div class="li-stats-section collapsed" id="liStatsSection">
                <div class="li-stats-header" onclick="document.getElementById('liStatsSection').classList.toggle('collapsed')">
                    <span class="li-stats-title">ðŸ“ˆ Stats</span>
                    <span class="li-stats-caret">^</span>
                </div>
                <div class="li-stats-body" id="levelInfoItems"></div>
            </div>
        </div>
    </div>

    <!-- God Crown Cinematic -->
    <div id="singularityCinematic">
        <div class="sc-distortion" id="scDistortion"></div>
        <div class="sc-mass" id="scMass"></div>
        <div class="sc-flash" id="scFlash"></div>
        <div class="sc-result" id="scResult"></div>
        <div class="sc-title" id="scTitle"></div>
        <div class="sc-subtitle" id="scSubtitle">50 gemas comprimidas en un punto infinito</div>
        <div class="sc-buttons" id="scButtons">
            <button class="sc-btn-collect" id="scCollectBtn">ðŸ“¦ Recoger</button>
        </div>
    </div>

    <div id="godCrownCinematic">
        <div class="gc-particles" id="gcParticles"></div>
        <div class="gc-galaxy" id="gcGem1"></div>
        <div class="gc-galaxy" id="gcGem2"></div>
        <div class="gc-flash" id="gcFlash"></div>
        <div class="gc-crown-result" id="gcCrown"></div>
        <div class="gc-title" id="gcTitle">ðŸ‘‘ CORONA DE DIOS ðŸ‘‘</div>
        <div class="gc-subtitle" id="gcSubtitle">El poder supremo ha sido forjado</div>
        <div class="gc-buttons" id="gcButtons">
            <button class="gc-btn gc-btn-reborn" onclick="godCrownReborn()">ðŸ”„ Renacer</button>
            <button class="gc-btn gc-btn-persist" onclick="godCrownPersist()">ðŸ‘‘ Persistir</button>
        </div>
    </div>
`;
