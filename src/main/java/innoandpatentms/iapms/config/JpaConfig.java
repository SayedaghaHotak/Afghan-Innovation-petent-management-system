package innoandpatentms.iapms.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;

@Configuration
@EnableJpaAuditing // This is the "switch" that turns on the date feature
public class JpaConfig {
}