#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    #[allow(unused_mut)]
    let mut builder = tauri::Builder::default();

    #[cfg(desktop)]
    {
        #[cfg(target_os = "linux")]
        let flags = tauri_plugin_window_state::StateFlags::MAXIMIZED;

        #[cfg(not(target_os = "linux"))]
        let flags = tauri_plugin_window_state::StateFlags::SIZE
            | tauri_plugin_window_state::StateFlags::POSITION
            | tauri_plugin_window_state::StateFlags::MAXIMIZED;

        builder = builder.plugin(
            tauri_plugin_window_state::Builder::default()
                .with_state_flags(flags)
                .build(),
        );
    }

    builder
        .invoke_handler(tauri::generate_handler![])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}

