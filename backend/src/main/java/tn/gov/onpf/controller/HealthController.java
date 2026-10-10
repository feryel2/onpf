package tn.gov.onpf.controller;
import org.springframework.web.bind.annotation.*; import java.util.*;
@RestController @CrossOrigin(origins="http://localhost:4200") public class HealthController { @GetMapping("/health") public Map<String,String> health(){return Collections.singletonMap("status","UP");} }
